import { type RapportId, RapportMedNedlastingsinfo } from '@src/schemas/types';
import RapportKort from '@src/components/RapportKort';
import { InfoCard, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { InformationSquareIcon } from '@navikt/aksel-icons';
import { TilbakeTilOrganisasjonsvelger } from '@src/components/TilbakeTilOrganisasjonsvelger.tsx';

interface RapportlisteProps {
  rapportliste: RapportMedNedlastingsinfo;
}

export default function Rapportliste({ rapportliste }: RapportlisteProps) {
  const [valgtRapport, setValgtRapport] = useState<RapportId | null>(
    rapportliste.forespurtRapportId,
  );

  return (
    <VStack gap="space-32">
      <TilbakeTilOrganisasjonsvelger
        type={rapportliste.type}
        orgNavn={rapportliste.orgNavn}
        orgnr={rapportliste.orgnr}
      />

      {rapportliste.rapporter.length === 0 && (
        <InfoCard data-color="info">
          <InfoCard.Message icon={<InformationSquareIcon aria-hidden />}>
            Det har ikke vært generert noen rapporter for denne
            organisasjonsenheten siden juni 2026.
          </InfoCard.Message>
        </InfoCard>
      )}

      {rapportliste.rapporter.map((rapport) => (
        <RapportKort
          rapportMetadata={rapport}
          rapportType={rapportliste.type}
          valgtRapport={valgtRapport}
          oppdaterValgtRapport={setValgtRapport}
          key={rapport.id}
        />
      ))}
    </VStack>
  );
}
