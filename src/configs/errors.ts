export class ConfigError extends Error {
  constructor(configPath: string, actualValue: any) {
    super(
      `unexpected config at path ${configPath}: ${JSON.stringify(actualValue)}`,
    );
  }
}
