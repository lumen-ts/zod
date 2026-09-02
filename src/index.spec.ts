import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { ZodSchema, zodSchema } from './index.js';
import { BadRequestException } from '@lumen/common';

describe('ZodSchema', () => {
  it('parses valid input and returns typed value', () => {
    const schema = new ZodSchema(z.object({ name: z.string() }));
    const result = schema.parse({ name: 'a' });
    expect(result).toEqual({ name: 'a' });
  });

  it('wraps invalid input in a BadRequestException with VALIDATION_ERROR code', () => {
    const schema = new ZodSchema(z.number());
    let caught: unknown;
    try {
      schema.parse('not a number');
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(BadRequestException);
    const exception = caught as BadRequestException;
    expect(exception.statusCode).toBe(400);
    expect(exception.code).toBe('VALIDATION_ERROR');
    expect(Array.isArray(exception.details)).toBe(true);
  });

  it('zodSchema factory returns a functional ZodSchema', () => {
    const schema = zodSchema(z.string().email());
    expect(schema.parse('a@b.com')).toBe('a@b.com');
  });

  it('partial() makes every field optional', () => {
    const schema = zodSchema(z.object({ id: z.number(), name: z.string() }));
    const partial = schema.partial();
    expect(partial.parse({})).toEqual({});
    expect(partial.parse({ name: 'x' })).toEqual({ name: 'x' });
  });
});
