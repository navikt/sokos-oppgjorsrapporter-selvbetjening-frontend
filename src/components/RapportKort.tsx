import { useState } from 'react';
import {
  Box,
  Button,
  ErrorSummary,
  ExpansionCard,
  HStack,
  VStack,
} from '@navikt/ds-react';
import {
  type RapportMetadata,
  RapportType,
  REPORT_TYPE_REF_ARBG,
  REPORT_TYPE_TREKK_HEND,
  REPORT_TYPE_TREKK_KRED,
} from '@src/schemas/types.ts';
import { DownloadIcon } from '@navikt/aksel-icons';
import { isoDatoTilNorskDato } from '@utils/dato-utils.ts';

interface RapportCardProps {
  rapportMetadata: RapportMetadata;
  rapportType: RapportType;
}

function rapportTittel(
  rapportType: RapportType,
  rapport: RapportMetadata,
): string {
  switch (rapportType) {
    case REPORT_TYPE_REF_ARBG:
      return `Oppgjørsrapport arbeidsgiver – refusjoner fra Nav (utbetalt ${isoDatoTilNorskDato(rapport.datoValutert)})`;
    case REPORT_TYPE_TREKK_HEND:
      return 'Trekkhendelser - tilbakemelding fra Nav'; // TODO: Dato eller annen rapport-id?
    case REPORT_TYPE_TREKK_KRED:
      return 'Trekkoppgjør fra Nav'; // TODO: Dato eller annen rapport-id?
  }
}

export default function RapportKort({
  rapportMetadata,
  rapportType,
}: RapportCardProps) {
  return (
    <ExpansionCard
      aria-label="Nedlastingsknapper for oppgjørsrapporter"
      defaultOpen={true}
    >
      <ExpansionCard.Header>
        <ExpansionCard.Title>
          {rapportTittel(rapportType, rapportMetadata)}
        </ExpansionCard.Title>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <Innhold id={rapportMetadata.id} />
      </ExpansionCard.Content>
    </ExpansionCard>
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
          <ErrorSummary heading="Feil ved nedlasting">
            <ErrorSummary.Item>{error}</ErrorSummary.Item>
          </ErrorSummary>
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
