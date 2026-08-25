import { useEffect, useState } from 'react';
import {
  BodyShort,
  Box,
  Button,
  ErrorSummary,
  ExpansionCard,
  HStack,
  Tag,
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
import { BellIcon, DownloadIcon, FileTextIcon } from '@navikt/aksel-icons';
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
      return `Oppgjørsrapport arbeidsgiver – refusjoner fra Nav. Utbetalt ${isoDatoTilNorskDato(rapport.datoValutert)}`;
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
  const alleredeLastetNed = rapportMetadata.varianterMedNedlastingsinfo.some(
    (variant) => !!variant.nedlastingsinfo?.sistLastetNed,
  );

  // -- Scroll til forespurt rapport
  useEffect(() => {
    const element = document.querySelector(
      `[data-rapport-id="${valgtRapport}"]`,
    );
    if (element) {
      // Dette ødelegger for tabindexen i chrome tydelivis, slik at "hopp til hovedinnhold" ikke er først i tabrekkefølgen
      // element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // --
      // Dette makverket under skroller siden til forespurt rapport uten å endre chrome sin tab focus
      // Regner med at det er en bedre måte å gjøre dette på, men det er beyond me
      const targetY = element.getBoundingClientRect().top + window.scrollY - 20;
      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <ExpansionCard
      data-rapport-id={rapportMetadata.id}
      data-color={alleredeLastetNed ? 'accent' : 'brand-beige'}
      aria-label={`Nedlastingsknapper for oppgjørsrapport med id ${rapportMetadata.id}`}
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
        <HStack wrap={false} gap="space-16" align="center">
          <FileTextIcon aria-hidden fontSize="3rem" />
          <ExpansionCard.Title>
            <VStack>
              {rapportTittel(rapportType, rapportMetadata)}
              {!alleredeLastetNed && (
                <ExpansionCard.Description>
                  <Tag size="small" variant="outline" data-color="danger">
                    <BellIcon aria-hidden />
                    Ulest rapport
                  </Tag>
                </ExpansionCard.Description>
              )}
            </VStack>
          </ExpansionCard.Title>
        </HStack>
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
            <VStack
              key={`${rapportMetadata.id}-${variant.format}`}
              gap="space-8"
              align="center"
            >
              <Button
                variant="primary"
                size="medium"
                onClick={() => hentRapport(variant)}
                icon={<DownloadIcon aria-hidden />}
                iconPosition="right"
                loading={isLoading === variant.format}
              >
                Last ned {variant.format.toUpperCase()}
              </Button>
              {variant.nedlastingsinfo != null && (
                <BodyShort size="small">
                  Sist lastet ned &nbsp;
                  {isoDateTimeTilNorskDatoMedKlokkeslett(
                    variant.nedlastingsinfo?.sistLastetNed,
                  )}
                </BodyShort>
              )}
            </VStack>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
}
