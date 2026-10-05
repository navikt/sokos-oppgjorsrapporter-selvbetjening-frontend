import { getAnalyticsInstance } from '@navikt/nav-dekoratoren-moduler';

const analyticsLogger = getAnalyticsInstance(
  'sokos-oppgjorsrapporter-selvbetjening-frontend',
);

const logEvent = async (lenketekst: string, destinasjon: string) => {
  await analyticsLogger('navigere', {
    lenketekst: lenketekst,
    destinasjon: destinasjon,
  });
};

export default logEvent;
