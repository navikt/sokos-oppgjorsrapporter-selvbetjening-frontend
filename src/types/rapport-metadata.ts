export interface TilgjengeligFormat {
  format: string;
  filNavn: string;
  id: string;
}

export interface RapportMetadata {
  bedriftNavn: string;
  orgnr: string;
  rapportTypeTeks: string;
  utbetaltDato: string;
  tilgjengeligeFormater: TilgjengeligFormat[];
}
