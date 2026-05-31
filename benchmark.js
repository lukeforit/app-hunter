import { performance } from 'perf_hooks';

// Simulate the hooks behavior
function simulateFilter(jobs, debouncedSearchQuery, statusFilter, workModeFilter) {
  const searchLower = debouncedSearchQuery.toLowerCase();
  return jobs.filter(j => {
    const matchesSearch = [j.companyName, j.role, j.location].some(f =>
      (f || '').toLowerCase().includes(searchLower)
    );
    const matchesStatus = statusFilter === null || j.status === statusFilter;
    const matchesWorkMode = workModeFilter === null || j.workMode === workModeFilter;

    return matchesSearch && matchesStatus && matchesWorkMode;
  });
}

function simulateOptimizedFilter(jobs, debouncedSearchQuery, statusFilter, workModeFilter) {
  if (!debouncedSearchQuery && statusFilter === null && workModeFilter === null) {
      return jobs;
  }

  const searchLower = debouncedSearchQuery.toLowerCase();

  return jobs.filter(j => {
    let matchesSearch = true;
    if (searchLower) {
      matchesSearch = (j.companyName || '').toLowerCase().includes(searchLower) ||
                      (j.role || '').toLowerCase().includes(searchLower) ||
                      (j.location || '').toLowerCase().includes(searchLower);
    }

    if (!matchesSearch) return false;

    const matchesStatus = statusFilter === null || j.status === statusFilter;
    if (!matchesStatus) return false;

    const matchesWorkMode = workModeFilter === null || j.workMode === workModeFilter;
    if (!matchesWorkMode) return false;

    return true;
  });
}

const jobs = [];
for (let i = 0; i < 100000; i++) {
  jobs.push({
    companyName: 'Company ' + i,
    role: 'Role ' + i,
    location: 'Location ' + i,
    status: i % 3 === 0 ? 'Sent' : 'Interviewing',
    workMode: 'Remote'
  });
}

const queries = ['', '123', 'Role 999', 'Company 500', 'missing'];

console.log("=== Benchmarking original ===");
for (const q of queries) {
  const start = performance.now();
  for(let i=0; i<10; i++) simulateFilter(jobs, q, null, null);
  const end = performance.now();
  console.log(`Original "${q}": ${(end - start).toFixed(2)} ms`);
}

console.log("=== Benchmarking optimized ===");
for (const q of queries) {
  const start = performance.now();
  for(let i=0; i<10; i++) simulateOptimizedFilter(jobs, q, null, null);
  const end = performance.now();
  console.log(`Optimized "${q}": ${(end - start).toFixed(2)} ms`);
}
