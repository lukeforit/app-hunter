import 'global-jsdom/register';
import { test, describe, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert';
import { renderHook, act } from '@testing-library/react';
import { useJobs } from './useJobs.ts';
import { JobFormData, JobStatus, WorkMode, JobEntry } from '../types.ts';

// Add missing DOMException for the test environment
if (typeof DOMException === 'undefined') {
  global.DOMException = class DOMException extends Error {
    constructor(message: string, name: string) {
      super(message);
      this.name = name;
    }
  } as any;
}

// Add missing crypto.randomUUID for the test environment
if (!global.crypto) {
  (global as any).crypto = {};
}
if (!global.crypto.randomUUID) {
  let counter = 0;
  global.crypto.randomUUID = () => `test-uuid-${counter++}`;
}

const STORAGE_KEY = 'the_hunter_jobs_v2';

const mockJob: JobEntry = {
  id: 'test-uuid-0',
  companyName: 'Test Corp',
  role: 'Software Engineer',
  location: 'Remote',
  workMode: WorkMode.REMOTE,
  dateApplied: '2023-10-15',
  link: 'https://example.com',
  status: JobStatus.SENT,
};

const mockFormData: JobFormData = {
  companyName: 'New Corp',
  role: 'Frontend Developer',
  location: 'New York',
  workMode: WorkMode.HYBRID,
  dateApplied: '2023-10-16',
  link: 'https://example.com/new',
  status: JobStatus.INTERVIEWING,
};

describe('useJobs', () => {
  beforeEach(() => {
    localStorage.clear();
    mock.restoreAll();
    mock.timers.enable({ apis: ['setTimeout'] });
    // Reset uuid counter
    let counter = 0;
    global.crypto.randomUUID = () => `test-uuid-${counter++}`;
  });

  afterEach(() => {
    mock.timers.reset();
    mock.restoreAll();
  });

  test('should initialize with empty jobs when localStorage is empty', () => {
    const { result } = renderHook(() => useJobs());
    assert.strictEqual(result.current.jobs.length, 0);
    assert.strictEqual(result.current.isLoaded, true);
  });

  test('should load jobs from localStorage on mount', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([mockJob]));
    const { result } = renderHook(() => useJobs());
    assert.strictEqual(result.current.jobs.length, 1);
    assert.deepStrictEqual(result.current.jobs[0], mockJob);
    assert.strictEqual(result.current.isLoaded, true);
  });

  test('should handle invalid JSON in localStorage gracefully', () => {
    const consoleSpy = mock.method(console, 'error', () => {});
    localStorage.setItem(STORAGE_KEY, 'invalid-json');

    const { result } = renderHook(() => useJobs());

    assert.strictEqual(result.current.jobs.length, 0);
    assert.strictEqual(result.current.isLoaded, true);
    assert.strictEqual(consoleSpy.mock.calls.length, 1);
    assert.ok(consoleSpy.mock.calls[0].arguments[0].includes('Failed to parse stored jobs'));
  });

  test('should not load non-array JSON from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'an array' }));
    const { result } = renderHook(() => useJobs());

    assert.strictEqual(result.current.jobs.length, 0);
    assert.strictEqual(result.current.isLoaded, true);
  });

  test('should add a job', () => {
    const { result } = renderHook(() => useJobs());

    act(() => {
      result.current.addJob(mockFormData);
    });

    assert.strictEqual(result.current.jobs.length, 1);
    assert.strictEqual(result.current.jobs[0].companyName, mockFormData.companyName);
    assert.strictEqual(result.current.jobs[0].id, 'test-uuid-0');

    act(() => {
      mock.timers.tick(600);
    });

    const savedJobs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    assert.strictEqual(savedJobs.length, 1);
    assert.strictEqual(savedJobs[0].companyName, mockFormData.companyName);
  });

  test('should update a job', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([mockJob]));
    const { result } = renderHook(() => useJobs());

    act(() => {
      result.current.updateJob('test-uuid-0', { status: JobStatus.REJECTED });
    });

    assert.strictEqual(result.current.jobs[0].status, JobStatus.REJECTED);

    act(() => {
      mock.timers.tick(600);
    });

    const savedJobs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    assert.strictEqual(savedJobs[0].status, JobStatus.REJECTED);
  });

  test('should delete a job', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([mockJob]));
    const { result } = renderHook(() => useJobs());

    assert.strictEqual(result.current.jobs.length, 1);

    act(() => {
      result.current.deleteJob('test-uuid-0');
    });

    assert.strictEqual(result.current.jobs.length, 0);

    act(() => {
      mock.timers.tick(600);
    });

    const savedJobs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    assert.strictEqual(savedJobs.length, 0);
  });

  test('should import jobs', () => {
    const { result } = renderHook(() => useJobs());

    act(() => {
      result.current.importJobs([mockJob]);
    });

    assert.strictEqual(result.current.jobs.length, 1);
    assert.deepStrictEqual(result.current.jobs[0], mockJob);

    act(() => {
      mock.timers.tick(600);
    });

    const savedJobs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    assert.strictEqual(savedJobs.length, 1);
    assert.deepStrictEqual(savedJobs[0], mockJob);
  });

  test('should handle QuotaExceededError when saving', () => {
    const consoleSpy = mock.method(console, 'error', () => {});

    // Mock localStorage.setItem to throw QuotaExceededError
    mock.method(Storage.prototype, 'setItem', () => {
      throw new DOMException('QuotaExceededError', 'QuotaExceededError');
    });

    const { result } = renderHook(() => useJobs());

    act(() => {
      result.current.addJob(mockFormData);
    });

    act(() => {
      mock.timers.tick(600);
    });

    assert.strictEqual(consoleSpy.mock.calls.length, 1);
    assert.ok(consoleSpy.mock.calls[0].arguments[0].includes('Critical: localStorage quota exceeded'));
  });

  test('should handle other errors when saving', () => {
    const consoleSpy = mock.method(console, 'error', () => {});

    // Mock localStorage.setItem to throw generic error
    mock.method(Storage.prototype, 'setItem', () => {
      throw new Error('Some storage error');
    });

    const { result } = renderHook(() => useJobs());

    act(() => {
      result.current.addJob(mockFormData);
    });

    act(() => {
      mock.timers.tick(600);
    });

    assert.strictEqual(consoleSpy.mock.calls.length, 1);
    assert.ok(consoleSpy.mock.calls[0].arguments[0].includes('Failed to save jobs to localStorage'));
  });
});
