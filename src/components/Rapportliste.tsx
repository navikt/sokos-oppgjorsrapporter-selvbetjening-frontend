import { type RapportId, RapportMedNedlastningsinfo } from '@src/schemas/types';
import { text } from '@src/language/text';
import RapportKort from '@src/components/RapportKort';
import { BodyLong, Heading, LocalAlert, VStack } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { setParams } from '@navikt/nav-dekoratoren-moduler';

interface RapportlisteProps {
  rapportliste: RapportMedNedlastningsinfo;
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
      {(rapportliste.type === 'ref-arbg' ||
        rapportliste.type === 'trekk-kred') && (
        <LocalAlert status="warning">
          <LocalAlert.Header>
            <LocalAlert.Title>OBS, unngå doble nedlastinger!</LocalAlert.Title>
          </LocalAlert.Header>
          <LocalAlert.Content>
            <BodyLong>
              Nav har nå begynt å sende ut oppgjørsrapporter (tidligere kalt K27
              og T14) via vår nye Altinn 3-baserte løsning.
            </BodyLong>
            <BodyLong>
              For å imøtekomme de som trenger litt tid til å tilpasse sine
              rutiner, vil vi også{' '}
              <b>
                {rapportliste.type === 'ref-arbg'
                  ? 'frem til 15. juni 2026'
                  : 'ut mai 2026'}
              </b>{' '}
              fortsette å sende tilsvarende rapporter fra den gamle løsningen.
            </BodyLong>
            <BodyLong>
              Rapportene fra ny og gammel løsning inneholder samme informasjon
              og svarer til samme utbetaling, men vil ha forskjellig tittel i
              Altinn-innboksen. Du trenger derfor{' '}
              <b>kun å laste ned én av dem</b>.
            </BodyLong>
          </LocalAlert.Content>
        </LocalAlert>
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
