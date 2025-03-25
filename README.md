# Zod Environment Validatior

A runtime environment variable validator with Zod. inspired on https://github.com/t3-oss/t3-env

## Installation

```bash
    npm install zod-environment
    # or
    yarn add zod-environment
    # or
    pnpm add zod-environment
    # or
    bun add zod-environment
```

## Usage

```typescript
import { z } from 'zod';
import { createEnv } from 'zod-environment';

createEnv({
    definitions: z.object({
        PORT: z.number().default(3000),
        NODE_ENV: z.enum(['development', 'production']).default('development'),
        DATABASE_URL: z.string().url().default('http://localhost:5432'),
        SECRET: z.string().default('secret'),
        ENABLED: z.boolean().default(true),
        RATE: z.number().default(0.5)
    }),
    accessors: {
        get port() {
            return Number(process.env.PORT);
        }
    }
});

console.log(process.env.PORT); // 3000
console.log(process.env.NODE_ENV); // development
console.log(process.env.DATABASE_URL); // http://localhost:5432
console.log(process.env.SECRET); // secret
console.log(process.env.ENABLED); // true
```
