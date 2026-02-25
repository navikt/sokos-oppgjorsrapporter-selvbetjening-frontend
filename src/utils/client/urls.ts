const isProduction = window.location.hostname === 'www.nav.no';
const isDevelopment = window.location.hostname.endsWith('.dev.nav.no');

type Environment = 'local' | 'development' | 'production';

export function getEnvironment(): Environment {
  if (isDevelopment) {
    return 'development';
  }
  if (isProduction) {
    return 'production';
  }
  return 'local';
}

type EnvUrl = Record<Environment, string>;

const BASE_URL: EnvUrl = {
  local: 'http://localhost:3000',
  development: 'https://www.ansatt.dev.nav.no/oppgjorsrapporter',
  production: 'https://www.nav.no/oppgjorsrapporter',
};

export const baseUrl = BASE_URL[getEnvironment()];
