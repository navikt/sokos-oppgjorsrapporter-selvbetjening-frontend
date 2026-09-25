import { BodyLong, Heading, Link, VStack } from '@navikt/ds-react';
import { text } from '@src/language/text.ts';
import ArrowLeft from 'node_modules/@navikt/aksel-icons/dist/react/esm/ArrowLeft';

export function TilbakeTilOrganisasjonsvelger(props: {
  type: 'ref-arbg' | 'trekk-kred' | 'trekk-hend';
  orgNavn: string | null | undefined;
  orgnr: string;
}) {
  return (
    <>
      <Link href={`/oppgjorsrapporter/${props.type}`}>
        <ArrowLeft aria-hidden />
        Tilbake til dine organisjasjoner
      </Link>
      <VStack>
        <Heading size="medium" level="2">
          {props.orgNavn}
        </Heading>
        <BodyLong>
          {text.orgNrLabel}: {props.orgnr}
        </BodyLong>
      </VStack>
    </>
  );
}
