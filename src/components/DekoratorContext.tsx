import type { RapportType } from '@src/schemas/types.ts';
import { useEffect } from 'react';
import { setBreadcrumbs, setParams } from '@navikt/nav-dekoratoren-moduler';

interface DekoratorContextProps {
  rapportType: RapportType;
  smuler?: DecoratorBreadcrumb[];
}

type DecoratorBreadcrumb = {
  url: string;
  title: string;
  analyticsTitle?: string;
  handleInApp?: boolean;
};

export const DekoratorContext = ({
  rapportType,
  smuler = [],
}: DekoratorContextProps) => {
  const context =
    rapportType === 'ref-arbg' ? 'arbeidsgiver' : 'samarbeidspartner';
  useEffect(() => {
    setParams({ context });
  }, [context]);

  const rotSmulerArbeidsgiver: DecoratorBreadcrumb[] = [
    {
      url: '/min-side-arbeidsgiver',
      title: 'Min side - arbeidsgiver',
    },
  ];
  const rotSmulerSamarbeidspartner: DecoratorBreadcrumb[] = [
    {
      url: '/samarbeidspartner',
      title: 'Samarbeidspartner',
    },
  ];

  const brodSmuler =
    context === 'arbeidsgiver'
      ? [...rotSmulerArbeidsgiver, ...smuler]
      : [...rotSmulerSamarbeidspartner, ...smuler];
  useEffect(() => {
    setBreadcrumbs(brodSmuler);
  }, [brodSmuler]);

  return null;
};
