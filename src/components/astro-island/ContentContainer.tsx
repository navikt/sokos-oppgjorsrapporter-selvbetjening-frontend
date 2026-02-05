import { Box, Button, ErrorSummary, VStack } from '@navikt/ds-react';
import { DownloadIcon } from '@navikt/aksel-icons';

interface ContentContainerProps {
  id: number;
}

export default function ContentContainer({ id }: ContentContainerProps) {
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
