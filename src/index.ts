import type { z } from 'zod';
import type { SchemaLike } from '@lumen/core';
import { BadRequestException } from '@lumen/common';

/** Wraps a Zod schema to satisfy the framework's SchemaLike contract. */
export class ZodSchema<T> implements SchemaLike<T> {
  constructor(public readonly schema: z.ZodType<T>) {}

  parse(input: unknown): T {
    const result = this.schema.safeParse(input);
    if (result.success) return result.data;
    throw new BadRequestException('Validation failed', result.error.issues, 'VALIDATION_ERROR');
  }

  /** Builds a wrapper for the partial (optional-fields) version of the schema. */
  partial(): ZodSchema<Partial<T>> {
    const partialable = this.schema as unknown as { partial(): z.ZodType<unknown> };
    return new ZodSchema<Partial<T>>(partialable.partial() as z.ZodType<Partial<T>>);
  }
}

/** Convenience factory for ZodSchema. */
export function zodSchema<T>(schema: z.ZodType<T>): ZodSchema<T> {
  return new ZodSchema(schema);
}
