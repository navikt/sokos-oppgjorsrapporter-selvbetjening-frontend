import { useState } from 'react';
import {
  BodyShort,
  Box,
  Button,
  ErrorSummary,
  ExpansionCard,
  HStack,
  VStack,
} from '@navikt/ds-react';
import {
  type RapportId,
  type RapportMetadata,
  RapportType,
  REPORT_TYPE_REF_ARBG,
  REPORT_TYPE_TREKK_HEND,
  REPORT_TYPE_TREKK_KRED,
  type VariantMedNedlastningsinfo,
} from '@src/schemas/types.ts';
import { DownloadIcon } from '@navikt/aksel-icons';
import {
  isoDateTimeTilNorskDatoMedKlokkeslett,
  isoDatoTilNorskDato,
} from '@utils/dato-utils.ts';

interface RapportCardProps {
  rapportMetadata: RapportMetadata;
  rapportType: RapportType;
  valgtRapport: RapportId | null;
  oppdaterValgtRapport: (rapportId: RapportId | null) => void;
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
  valgtRapport,
  oppdaterValgtRapport,
}: RapportCardProps) {
  const alleredeLastetNed = !rapportMetadata.varianterMedNedlastingsinfo.some(
    (variant) => !!variant.sistLastetNed,
  );

  return (
    <ExpansionCard
      data-color={alleredeLastetNed ? 'brand-beige' : 'accent'}
      aria-label="Nedlastingsknapper for oppgjørsrapporter"
      open={rapportMetadata.id === valgtRapport}
      onToggle={(open: boolean) => {
        if (open) {
          oppdaterValgtRapport(rapportMetadata.id);
        } else {
          oppdaterValgtRapport(null);
        }
      }}
    >
      <ExpansionCard.Header>
        <ExpansionCard.Title>
          {rapportTittel(rapportType, rapportMetadata)}
        </ExpansionCard.Title>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <Innhold rapportMetadata={rapportMetadata} />
      </ExpansionCard.Content>
    </ExpansionCard>
  );
}

interface InnholdProps {
  rapportMetadata: RapportMetadata;
}

function Innhold({ rapportMetadata }: InnholdProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<'pdf' | 'csv' | null>(null);

  const hentRapport = async (variant: VariantMedNedlastningsinfo) => {
    setError(null);
    setIsLoading(variant.format);

    try {
      const url = `/oppgjorsrapporter/rapport/${rapportMetadata.id}/innhold?type=${variant.format}`;
      const response = await fetch(url);

      if (!response.ok) {
        setError(
          `Noe gikk galt ved nedlasting av ${variant.format.toUpperCase()}-rapporten.`,
        );
        return;
      }

      const blob = await response.blob();
      let filename = variant.filnavn;
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
          {rapportMetadata.varianterMedNedlastingsinfo.map((variant) => (
            <VStack key={`${rapportMetadata.id}-${variant.format}`}>
              <Button
                variant="primary"
                size="medium"
                onClick={() => hentRapport(variant)}
                icon={<DownloadIcon aria-hidden />}
                iconPosition="right"
                loading={isLoading === variant.format}
              >
                Last ned rapporten som {variant.format.toUpperCase()}
              </Button>
              {variant.sistLastetNed && (
                <BodyShort size="small">
                  Sist lastet ned &nbsp;
                  {isoDateTimeTilNorskDatoMedKlokkeslett(variant.sistLastetNed)}
                </BodyShort>
              )}
            </VStack>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
}
