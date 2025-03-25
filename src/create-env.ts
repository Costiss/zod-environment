import type { ZodObject, ZodRawShape } from 'zod';

export type EnvOpts = {
    /** A Zod object containing the schema definitions for the environment variables */
    definitions: ZodObject<ZodRawShape>;

    /**
     * Accessors are used to map environment variables to a different name or to transform them.
     * Default accessors are always `process.env.VAR_NAME`.
     *
     * Example:
     * ```ts
     *   {
     *       definitions: z.object({
     *           ENV_VAR1: z.string(),
     *           ENV_VAR2: z.string(),
     *       }),
     *       accessors: {
     *           ENV_VAR1: 'NEW_ENV_VAR1',
     *           get ENV_VAR2() {
     *               return process.env.ENV_VAR2.toUpperCase();
     *           },
     *       }
     *   }
     * ```
     **/
    accessors?: Record<string, string>;

    /** What to do when the environment variables are invalid. Defaults to `exit` */
    invalidBehavior?: 'exit' | 'throw';
};

type FieldErrors = [string, string[]];

/**
 * Creates and validates the environment variables from the provided EnvOpts
 */
export function createEnv(opts: EnvOpts) {
    const result = opts.definitions.safeParse({
        ...process.env,
        ...opts.accessors
    });
    const callback = getInvalidCallback(opts);

    if (result.error) {
        const fieldsErrors = Object.entries(result.error.formErrors.fieldErrors) as FieldErrors[];

        callback(fieldsErrors);
    }

    process.env = { ...process.env, ...result.data };
}

function getInvalidCallback(opts: EnvOpts): (fieldsErrors: FieldErrors[]) => void {
    switch (opts.invalidBehavior) {
        case 'throw':
            return (e) => {
                throw new EnvError(e);
            };
        default:
            return (e) => {
                console.info(formatErrorMessages(e));
                process.exit(1);
            };
    }
}

function formatErrorMessages(errors: FieldErrors[]) {
    return (
        'Invalid environment variables:\n' +
        errors.map(([field, messages]) => `❌ ${field}: ${messages.join(', ')}`).join('\n')
    );
}

export class EnvError extends Error {
    constructor(ferrors: FieldErrors[]) {
        const message = formatErrorMessages(ferrors);
        super(message);
        this.name = 'EnvError';
    }
}
