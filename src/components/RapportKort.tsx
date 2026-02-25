import { useState } from 'react';
import {
  BodyLong,
  Box,
  Button,
  ErrorSummary,
  ExpansionCard,
  Heading,
  VStack,
} from '@navikt/ds-react';
import { text } from '@src/language/text.ts';
import type { RapportMetadata } from '@src/schemas/types.ts';
import { DownloadIcon } from '@navikt/aksel-icons';
import { isoDatoTilNorskDato } from '@utils/dato-utils.ts';

interface RapportCardProps {
  rapportMetadata: RapportMetadata;
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
      <ExpansionCard
        aria-label="Nedlasningsknapper for oppgjørsrapporter"
        defaultOpen={true}
      >
        <ExpansionCard.Header>
          <ExpansionCard.Title>
            Oppgjørsrapport arbeidsgiver – refusjoner fra Nav. Utbetalt
            {isoDatoTilNorskDato(rapportMetadata.datoValutert)}
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
    <Box paddingBlock={'2'}>
      <VStack gap="2" align="center">
        {error && (
          <ErrorSummary heading="Feil ved nedlasting">{error}</ErrorSummary>
        )}
        <Button
          variant="secondary"
          size="medium"
          onClick={() => hentRapport('pdf')}
          icon={<DownloadIcon aria-hidden />}
          loading={isLoading === 'pdf'}
        >
          Oppgjørsrapport arbeidsgiver – refusjoner fra Nav - PDF
        </Button>
        <Button
          variant="secondary"
          size="medium"
          onClick={() => hentRapport('csv')}
          icon={<DownloadIcon aria-hidden />}
          loading={isLoading === 'csv'}
        >
          Oppgjørsrapport arbeidsgiver – refusjoner fra Nav - CSV
        </Button>
      </VStack>
    </Box>
  );
}
