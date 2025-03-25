import { z } from 'zod';
import { createEnv, type EnvOpts } from '.';

describe('createEnv', () => {
    const env: EnvOpts = {
        definitions: z.object({
            ENV_VAR1: z.string(),
            ENV_VAR2: z.string(),
            ENV_VAR3: z.string().default('default_value'),
            ENV_VAR4: z.string()
        }),
        accessors: {
            get ENV_VAR4() {
                return 'value4';
            }
        }
    };

    it('should call process exit 1 if env var is invalid', () => {
        process.env = {
            ENV_VAR1: 'value1'
        };

        process.exit = vi.fn() as never;
        console.info = vi.fn();

        createEnv(env);

        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(process.exit).toHaveBeenCalledWith(1);
        expect(console.info).toHaveBeenCalledWith(
            `Invalid environment variables:\n❌ ENV_VAR2: Required`
        );
    });

    it('should throw when using invalidBehavior throw', () => {
        process.env = {
            ENV_VAR1: 'value1'
        };

        process.exit = vi.fn() as never;
        console.info = vi.fn();

        expect(() => {
            createEnv({ ...env, invalidBehavior: 'throw' });
        }).toThrowError('Invalid environment variables');
    });

    it('should update env or valid config', () => {
        process.env = {
            ENV_VAR1: 'value1',
            ENV_VAR2: 'value2'
        };
        process.exit = vi.fn() as never;
        console.info = vi.fn();

        createEnv(env);

        expect(console.info).not.toHaveBeenCalled();
        expect(process.env).toEqual({
            ENV_VAR1: 'value1',
            ENV_VAR2: 'value2',
            ENV_VAR3: 'default_value',
            ENV_VAR4: 'value4'
        });
    });
});
