import { ValueTransformer } from 'typeorm';

export const blob: ValueTransformer = {
  to: (entityValue: string) => entityValue,
  from: (databaseValue: string): string => Buffer.from(databaseValue).toString()
};
