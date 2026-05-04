<?php
/**
 * Hybrid Proxy for Gemini API
 * Fallback for environments where Node.js is not available (e.g., Plesk shared hosting)
 */

// 1. Function to parse .env file
function loadEnv($path) {
    if (!file_exists($path)) {
        return false;
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);
            // Remove quotes if present
            if (preg_match('/^"(.*)"$/', $value, $matches) || preg_match("/^'(.*)'$/", $value, $matches)) {
                $value = $matches[1];
            }
            $_ENV[$name] = $value;
            putenv(sprintf('%s=%s', $name, $value));
        }
    }
    return true;
}

// Attempt to load .env from current directory or parent directory
if (!loadEnv(__DIR__ . '/.env')) {
    loadEnv(dirname(__DIR__) . '/.env');
}

$apiKey = $_ENV['GEMINI_API_KEY'] ?? getenv('GEMINI_API_KEY');
$allowedOriginEnv = $_ENV['ALLOWED_ORIGIN'] ?? getenv('ALLOWED_ORIGIN');

if (!$apiKey || !$allowedOriginEnv) {
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration error. API key or Allowed Origin missing.']);
    exit;
}

// 2. CORS Handling
$allowedOrigins = array_map('trim', explode(',', $allowedOriginEnv));
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else if (empty($origin)) {
    // Allow same-origin requests (no Origin header) or define behavior
    // For safety, we will let it pass but not output ACA-Origin
} else {
    http_response_code(403);
    echo json_encode(['error' => "CORS: Origin '$origin' is not allowed"]);
    exit;
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json');

// 3. Request Validation
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (!$input || !isset($input['text']) || !is_string($input['text'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Request body must contain a "text" string.']);
    exit;
}

$text = trim($input['text']);

if (strlen($text) < 20) {
    http_response_code(400);
    echo json_encode(['error' => 'Input too short to be a valid job posting.']);
    exit;
}

if (strlen($text) > 10000) {
    http_response_code(400);
    echo json_encode(['error' => 'Input too long (max 10 000 characters).']);
    exit;
}

// 4. Construct Gemini API Request
$geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" . $apiKey;

$payload = [
    "systemInstruction" => [
        "parts" => [
            ["text" => "You are a high-precision recruitment data extractor. Analyze the input and map it to: companyName, role, location, workMode (On-site, Remote, Hybrid), link, and salary. Salary Extraction Rules: 1. If a range is provided (e.g., \"$120k - $150k\"), extract only the maximum numerical value (e.g., \"$150,000\"). 2. If no salary is found, return an empty string. 3. Include currency symbols if present. Defaults: workMode = 'On-site'."]
        ]
    ],
    "contents" => [
        [
            "parts" => [
                ["text" => "Extract job details from this text or URL. Return JSON.\n\nSource Content:\n" . $text]
            ]
        ]
    ],
    "generationConfig" => [
        "responseMimeType" => "application/json",
        "responseSchema" => [
            "type" => "OBJECT",
            "properties" => [
                "companyName" => ["type" => "STRING"],
                "role"        => ["type" => "STRING"],
                "location"    => ["type" => "STRING"],
                "workMode"    => ["type" => "STRING", "enum" => ["On-site", "Remote", "Hybrid"]],
                "link"        => ["type" => "STRING"],
                "salary"      => ["type" => "STRING"]
            ],
            "required" => ["companyName", "role", "location", "workMode"]
        ]
    ]
];

// 5. Send Request using cURL
$ch = curl_init($geminiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_FAILONERROR, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 25); // Set timeout to avoid nginx 504 gateway timeout
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4); // Force IPv4 to fix Plesk timeout issues

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(502);
    echo json_encode(['error' => 'AI service unavailable. cURL Error: ' . $error]);
    exit;
}

if ($httpCode >= 400) {
    if ($httpCode === 429) {
         http_response_code(429);
         echo json_encode(['error' => 'AI quota exceeded. Try again later.']);
         exit;
    }
    http_response_code(502);
    
    // Attempt to parse the Gemini error message if available
    $errorMsg = 'AI service unavailable. HTTP Code: ' . $httpCode;
    $decodedResponse = json_decode($response, true);
    if (isset($decodedResponse['error']['message'])) {
        $errorMsg .= ' Details: ' . $decodedResponse['error']['message'];
    }
    
    echo json_encode(['error' => $errorMsg]);
    exit;
}

// 6. Format and Return Response
$responseData = json_decode($response, true);
$extractedText = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? '{}';

echo $extractedText;
