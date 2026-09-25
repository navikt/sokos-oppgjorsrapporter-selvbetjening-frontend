import {
  type RapportType,
  REPORT_TYPE_REF_ARBG,
  REPORT_TYPE_TREKK_HEND,
  REPORT_TYPE_TREKK_KRED,
} from '@src/schemas/types.ts';
import { Heading, Radio, RadioGroup, VStack } from '@navikt/ds-react';

interface VirksomhetslisteHeaderProps {
  rapportType: RapportType;
}

export const VirksomhetslisteHeader = ({
  rapportType,
}: VirksomhetslisteHeaderProps) => {
  switch (rapportType) {
    case REPORT_TYPE_REF_ARBG:
      return <RefusjonArbeidsgiverHeader />;
    case REPORT_TYPE_TREKK_KRED:
    case REPORT_TYPE_TREKK_HEND:
      return <TrekkinformasjonHeader rapportType={rapportType} />;
  }
};

const RefusjonArbeidsgiverHeader = () => {
  return (
    <Heading size="medium" level="2">
      Organisasjonsenheter du har tilgang til for refusjoner:
    </Heading>
  );
};

const TrekkinformasjonHeader = ({
  rapportType,
}: VirksomhetslisteHeaderProps) => {
  return (
    <VStack gap="space-16">
      <RadioGroup
        legend="Type rapport"
        value={rapportType}
        onChange={(r) => window.location.assign(`/oppgjorsrapporter/${r}/`)}
      >
        <Radio value="trekk-kred">Trekkoppgjør</Radio>
        <Radio value="trekk-hend">Trekkhendelse</Radio>
      </RadioGroup>

      <Heading size="medium" level="2">
        Organisasjonsenheter du har tilgang til for trekkinformasjon:
      </Heading>
    </VStack>
  );
};
