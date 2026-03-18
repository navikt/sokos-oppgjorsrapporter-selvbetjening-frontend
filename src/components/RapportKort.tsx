import { useState } from 'react';
import {
  BodyLong,
  Box,
  Button,
  ErrorSummary,
  ExpansionCard,
  Heading,
  HStack,
  LocalAlert,
  VStack,
} from '@navikt/ds-react';
import { text } from '@src/language/text.ts';
import {
  type RapportMetadata,
  REPORT_TYPE_REF_ARBG,
  REPORT_TYPE_TREKK_HEND,
  REPORT_TYPE_TREKK_KRED,
} from '@src/schemas/types.ts';
import { DownloadIcon } from '@navikt/aksel-icons';
import { isoDatoTilNorskDato } from '@utils/dato-utils.ts';
import { match, P } from 'ts-pattern';

interface RapportCardProps {
  rapportMetadata: RapportMetadata;
}

function rapportTittel(rapport: RapportMetadata): string {
  return match(rapport)
    .with(
      { type: REPORT_TYPE_REF_ARBG, datoValutert: P.select() },
      (utbetalt) =>
        `Oppgjørsrapport arbeidsgiver – refusjoner fra Nav (utbetalt ${isoDatoTilNorskDato(utbetalt)})`,
    )
    .with(
      { type: REPORT_TYPE_TREKK_HEND },
      () => 'Trekkhendelser - tilbakemelding fra Nav', // TODO: Dato eller annen rapport-id?
    )
    .with(
      { type: REPORT_TYPE_TREKK_KRED },
      () => 'Trekkoppgjør fra Nav', // TODO: Dato eller annen rapport-id?
    )
    .exhaustive();
}

export default function RapportKort({ rapportMetadata }: RapportCardProps) {
  return (
    <VStack gap="space-32">
      <VStack>
        <Heading size="medium">{rapportMetadata.orgNavn}</Heading>
        <BodyLong>
          {text.orgNrLabel}: {rapportMetadata.orgnr}
        </BodyLong>
      </VStack>
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
            rutiner, vil vi også <b>ut mai 2026</b> fortsette å sende
            tilsvarende rapporter fra den gamle løsningen.
          </BodyLong>
          <BodyLong>
            Rapportene fra ny og gammel løsning inneholder samme informasjon og
            svarer til samme utbetaling, men vil ha forskjellig tittel i
            Altinn-innboksen. Du trenger derfor <b>kun å laste ned én av dem</b>
            .
          </BodyLong>
        </LocalAlert.Content>
      </LocalAlert>
      <ExpansionCard
        aria-label="Nedlastingsknapper for oppgjørsrapporter"
        defaultOpen={true}
      >
        <ExpansionCard.Header>
          <ExpansionCard.Title>
            {rapportTittel(rapportMetadata)}
          </ExpansionCard.Title>
        </ExpansionCard.Header>
        <ExpansionCard.Content>
          <Innhold id={rapportMetadata.id} />
        </ExpansionCard.Content>
      </ExpansionCard>
    </VStack>
  );
}

interface InnholdProps {
  id: number;
}

function Innhold({ id }: InnholdProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<'pdf' | 'csv' | null>(null);

  const hentRapport = async (type: 'pdf' | 'csv') => {
    setError(null);
    setIsLoading(type);

    try {
      const url = `/oppgjorsrapporter/rapport/${id}/innhold?type=${type}`;
      const response = await fetch(url);

      if (!response.ok) {
        setError(
          `Noe gikk galt ved nedlasting av ${type.toUpperCase()}-rapporten.`,
        );
        return;
      }

      const blob = await response.blob();
      let filename = `oppgjorsrapport_${id}.${type}`;
      const cdValue = response.headers?.get('Content-Disposition');
      if (cdValue) {
        const filenameMatch =
          /filename\s*=\s*("(?<quoted>(?:[^"\\]|\\.)+)"|(?<unquoted>[^;]+))/.exec(
            cdValue,
          );
        if (filenameMatch && filenameMatch.groups) {
          const { quoted, unquoted } = filenameMatch.groups;
          filename = quoted || unquoted;
        }
      }
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      setError('Det oppstod en teknisk feil ved nedlasting.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <Box paddingBlock="space-8">
      <VStack gap="space-32" align="center">
        {error && (
          <ErrorSummary heading="Feil ved nedlasting">{error}</ErrorSummary>
        )}
        <HStack gap="space-32" justify="center">
          {(['pdf', 'csv'] as const).map((format) => (
            <Button
              key={format}
              variant="primary"
              size="medium"
              onClick={() => hentRapport(format)}
              icon={<DownloadIcon aria-hidden />}
              iconPosition="right"
              loading={isLoading === format}
            >
              Last ned {format.toUpperCase()}
            </Button>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
}
