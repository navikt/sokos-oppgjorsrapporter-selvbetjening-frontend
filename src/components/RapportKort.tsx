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
  const hentRapport = async (id: number, type: 'pdf' | 'csv') => {
    const response = await fetch(
      `/oppgjorsrapporter/api/rapport/hent-rapport-innhold?id=${id}&type=${type}`,
      {
        method: 'GET',
      },
    );
    if (!response.ok) {
      return (
        <ErrorSummary>Noe gikk galt ved nedlasting av rapporten.</ErrorSummary>
      );
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download =
      type === 'pdf'
        ? `oppgjorsrapport_arbeidsgiver_${id}.pdf`
        : `oppgjorsrapport_arbeidsgiver_${id}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };
  return (
    <Box paddingBlock={'2'}>
      <VStack gap="2" align="center">
        <Button
          variant="secondary"
          size="medium"
          onClick={() => hentRapport(id, 'pdf')}
          icon={<DownloadIcon aria-hidden />}
        >
          Oppgjørsrapport arbeidsgiver – refusjoner fra Nav - PDF
        </Button>
        <Button
          variant="secondary"
          size="medium"
          onClick={() => hentRapport(id, 'csv')}
          icon={<DownloadIcon aria-hidden />}
        >
          Oppgjørsrapport arbeidsgiver – refusjoner fra Nav - CSV
        </Button>
      </VStack>
    </Box>
  );
}
