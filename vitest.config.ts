import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    watch: false,
    coverage: {
      thresholds: {
        lines: 80,
        functions: 90,
        statements: 90,
        branches: 90,
      },
      include: ["src/**/*"],
      reporter: ["lcov"],
      provider: "v8",
    },
  },
});
