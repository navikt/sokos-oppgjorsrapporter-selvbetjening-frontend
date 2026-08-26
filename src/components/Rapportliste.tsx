import { type RapportId, RapportMedNedlastingsinfo } from '@src/schemas/types';
import { text } from '@src/language/text';
import RapportKort from '@src/components/RapportKort';
import { BodyLong, Heading, VStack } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { setParams } from '@navikt/nav-dekoratoren-moduler';

interface RapportlisteProps {
  rapportliste: RapportMedNedlastingsinfo;
}

export default function Rapportliste({ rapportliste }: RapportlisteProps) {
  const context =
    rapportliste.type == 'ref-arbg' ? 'arbeidsgiver' : 'samarbeidspartner';
  useEffect(() => {
    setParams({ context });
  }, [context]);

  const [valgtRapport, setValgtRapport] = useState<RapportId | null>(
    rapportliste.forespurtRapportId,
  );

  return (
    <VStack gap="space-32">
      <VStack>
        <Heading size="medium" level="2">
          {rapportliste.orgNavn}
        </Heading>
        <BodyLong>
          {text.orgNrLabel}: {rapportliste.orgnr}
        </BodyLong>
      </VStack>
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
