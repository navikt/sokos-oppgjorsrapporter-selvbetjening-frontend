import { type RapportId, RapportMedNedlastingsinfo } from '@src/schemas/types';
import { text } from '@src/language/text';
import RapportKort from '@src/components/RapportKort';
import { BodyLong, Heading, InfoCard, Link, VStack } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { setParams } from '@navikt/nav-dekoratoren-moduler';
import ArrowLeft from 'node_modules/@navikt/aksel-icons/dist/react/esm/ArrowLeft';
import { InformationSquareIcon } from '@navikt/aksel-icons';

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
      <Link href={`/oppgjorsrapporter/${rapportliste.type}`}>
        <ArrowLeft aria-hidden />
        Tilbake til dine organisjasjoner
      </Link>
      <VStack>
        <Heading size="medium" level="2">
          {rapportliste.orgNavn}
        </Heading>
        <BodyLong>
          {text.orgNrLabel}: {rapportliste.orgnr}
        </BodyLong>
      </VStack>

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
