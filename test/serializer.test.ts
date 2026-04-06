import { describe, it, expect } from 'vitest';
import type { Task, TaskStore } from '../src/types.js';
import { serializeTasks, deserializeTasks, exportStore } from '../src/serializer.js';

const makeTasks = (): Task[] => [
  {
    id: '1',
    title: 'First task',
    status: 'todo',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
  },
  {
    id: '2',
    title: 'Second task',
    status: 'done',
    createdAt: new Date('2026-02-01T00:00:00.000Z'),
    updatedAt: new Date('2026-02-03T00:00:00.000Z'),
  },
];

describe('serializeTasks', () => {
  it('converts tasks to a JSON string', () => {
    const tasks = makeTasks();
    const json = serializeTasks(tasks);
    const parsed = JSON.parse(json);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].title).toBe('First task');
  });
});

describe('deserializeTasks', () => {
  it('parses JSON back to Task objects with Date fields', () => {
    const tasks = makeTasks();
    const json = serializeTasks(tasks);
    const result = deserializeTasks(json);

    expect(result).toHaveLength(2);
    expect(result[0].createdAt).toBeInstanceOf(Date);
    expect(result[0].updatedAt).toBeInstanceOf(Date);
    expect(result[0].createdAt.toISOString()).toBe('2026-01-01T00:00:00.000Z');
    expect(result[0].updatedAt.toISOString()).toBe('2026-01-02T00:00:00.000Z');
    expect(result[1].status).toBe('done');
  });

  it('handles an empty array', () => {
    const result = deserializeTasks('[]');
    expect(result).toEqual([]);
  });
});

describe('exportStore', () => {
  it('serializes all tasks from a store', () => {
    const tasks = makeTasks();
    const store: TaskStore = {
      add: () => tasks[0],
      get: () => undefined,
      list: () => tasks,
      update: () => tasks[0],
      remove: () => false,
    };

    const json = exportStore(store);
    const result = deserializeTasks(json);
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('First task');
    expect(result[1].createdAt).toBeInstanceOf(Date);
  });
});
