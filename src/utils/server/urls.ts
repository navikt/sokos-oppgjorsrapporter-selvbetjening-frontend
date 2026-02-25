const isDevelopment = process.env.NAIS_CLUSTER_NAME === 'dev-gcp';
export const isLocal = process.env.NODE_ENV === 'development';

type Environment = 'local' | 'development' | 'production';

export function getEnvironment(): Environment {
  if (isDevelopment) {
    return 'development';
  }

  if (isLocal) {
    return 'local';
  }

  return 'production';
}

type EnvUrl = Record<Environment, string>;

const OPPGJORSRAPPORTER_API_URL: EnvUrl = {
  local: 'http://localhost:3000/api/rapport/v1',
  development: `${process.env.SOKOS_OPPGJORSRAPPORTER_API}/api/rapport/v1`,
  production: `${process.env.SOKOS_OPPGJORSRAPPORTER_API}/api/rapport/v1`,
};

const BASE_URL: EnvUrl = {
  local: 'http://localhost:4321/oppgjorsrapporter/',
  development: 'https://www.ansatt.dev.nav.no/oppgjorsrapporter/',
  production: 'https://www.nav.no/oppgjorsrapporter/',
};

export const oppgjorsrapporterApiUrl =
  OPPGJORSRAPPORTER_API_URL[getEnvironment()];
export const baseUrl = BASE_URL[getEnvironment()];
