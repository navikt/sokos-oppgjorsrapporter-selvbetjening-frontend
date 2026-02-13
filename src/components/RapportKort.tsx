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
import type { Language } from '@src/language/language.ts';
import { text } from '@src/language/text.ts';
import type { RapportDTO } from '@src/schemas/types.ts';
import { DownloadIcon } from '@navikt/aksel-icons';
import { isoDatoTilNorskDato } from '@utils/dato-utils.ts';

interface RapportCardProps {
  rapportMetaData: RapportDTO;
  language: Language;
}

export default function RapportKort({
  rapportMetaData,
  language,
}: RapportCardProps) {
  return (
    <VStack gap="space-32">
      <VStack>
        <Heading size="medium">{rapportMetaData.orgNavn}</Heading>
        <BodyLong>
          {text.orgNrLabel[language]}: {rapportMetaData.orgnr}
        </BodyLong>
      </VStack>
      <ExpansionCard aria-label="Nedlasningsknapper for oppgjørsrapporter">
        <ExpansionCard.Header>
          <ExpansionCard.Title>
            Oppgjørsrapport arbeidsgiver – refusjoner fra Nav. Utbetalt{' '}
            {isoDatoTilNorskDato(rapportMetaData.datoValutert)}
          </ExpansionCard.Title>
        </ExpansionCard.Header>
        <ExpansionCard.Content>
          <Innhold id={rapportMetaData.id} />
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
      const url = `/oppgjorsrapporter/api/rapport/hent-rapport-innhold?id=${id}&type=${type}`;
      const response = await fetch(url);

      if (!response.ok) {
        setError(
          `Noe gikk galt ved nedlasting av ${type.toUpperCase()}-rapporten.`,
        );
        return;
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `oppgjorsrapport_arbeidsgiver_${id}.${type}`;
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
