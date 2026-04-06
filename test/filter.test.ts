import { describe, it, expect } from 'vitest';
import type { Task } from '../src/types.js';
import { filterByStatus, searchByTitle, sortByDate } from '../src/filter.js';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Default task',
    status: 'todo',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  };
}

const tasks: Task[] = [
  makeTask({ id: '1', title: 'Buy groceries', status: 'todo', createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-03') }),
  makeTask({ id: '2', title: 'Write tests', status: 'in-progress', createdAt: new Date('2026-01-02'), updatedAt: new Date('2026-01-02') }),
  makeTask({ id: '3', title: 'Buy milk', status: 'done', createdAt: new Date('2026-01-03'), updatedAt: new Date('2026-01-01') }),
];

describe('filterByStatus', () => {
  it('returns tasks matching the given status', () => {
    expect(filterByStatus(tasks, 'todo')).toEqual([tasks[0]]);
    expect(filterByStatus(tasks, 'in-progress')).toEqual([tasks[1]]);
    expect(filterByStatus(tasks, 'done')).toEqual([tasks[2]]);
  });

  it('returns empty array when no tasks match', () => {
    expect(filterByStatus([], 'todo')).toEqual([]);
    expect(filterByStatus([tasks[0]], 'done')).toEqual([]);
  });
});

describe('searchByTitle', () => {
  it('returns tasks whose title contains the query (case-insensitive)', () => {
    expect(searchByTitle(tasks, 'buy')).toEqual([tasks[0], tasks[2]]);
    expect(searchByTitle(tasks, 'BUY')).toEqual([tasks[0], tasks[2]]);
    expect(searchByTitle(tasks, 'tests')).toEqual([tasks[1]]);
  });

  it('returns empty array when no titles match', () => {
    expect(searchByTitle(tasks, 'nonexistent')).toEqual([]);
  });
});

describe('sortByDate', () => {
  it('sorts by createdAt ascending', () => {
    const sorted = sortByDate(tasks, 'createdAt', 'asc');
    expect(sorted.map((t) => t.id)).toEqual(['1', '2', '3']);
  });

  it('sorts by createdAt descending', () => {
    const sorted = sortByDate(tasks, 'createdAt', 'desc');
    expect(sorted.map((t) => t.id)).toEqual(['3', '2', '1']);
  });

  it('sorts by updatedAt ascending', () => {
    const sorted = sortByDate(tasks, 'updatedAt', 'asc');
    expect(sorted.map((t) => t.id)).toEqual(['3', '2', '1']);
  });

  it('sorts by updatedAt descending', () => {
    const sorted = sortByDate(tasks, 'updatedAt', 'desc');
    expect(sorted.map((t) => t.id)).toEqual(['1', '2', '3']);
  });

  it('does not mutate the original array', () => {
    const original = [...tasks];
    sortByDate(tasks, 'createdAt', 'desc');
    expect(tasks).toEqual(original);
  });
});
