import { type RapportId, RapportMedNedlastingsinfo } from '@src/schemas/types';
import { text } from '@src/language/text';
import RapportKort from '@src/components/RapportKort';
import { BodyLong, Heading, Link, VStack } from '@navikt/ds-react';
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
      <BodyLong>
        Nedlastingssiden på nav.no fungerer nå som et arkiv for alle
        oppgjørsrapportene dine. Du kan logge inn direkte på
        <Link href="https://www.nav.no/arbeidsgiver">
          nav.no/arbeidsgiver
        </Link>{' '}
        og trenger ikke lenger å laste ned rapportene via melding i Altinn. Du
        vil fortsatt få varsel i Altinn når en ny oppgjørsrapport er
        tilgjengelig.
        <br />
        Les mer om oppgjørsrapporter og tilganger:{' '}
        <Link href="https://www.nav.no/arbeidsgiver/oppgjorsrapport">
          nav.no/arbeidsgiver/oppgjorsrapport
        </Link>
      </BodyLong>
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
