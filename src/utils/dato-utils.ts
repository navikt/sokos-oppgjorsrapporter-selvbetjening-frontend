import dayjs from 'dayjs';

const datoFormatNorsk = 'DD.MM.YYYY';

export function isoDatoTilNorskDato(date: string | undefined): string {
  if (!date) {
    return '';
  }

  let parsedDate = dayjs(date, 'YYYY-MM-DD', true);

  if (!parsedDate.isValid()) {
    parsedDate = dayjs(date);
  }

  return parsedDate.isValid() ? parsedDate.format(datoFormatNorsk) : date;
}

export const isoDateTimeTilNorskDatoMedKlokkeslett = (input: string) => {
  // -- valider input
  const dato = new Date(input);
  if (isNaN(dato.getTime())) {
    return input;
  }

  // -- formater dato
  return new Intl.DateTimeFormat('nb-NO', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(dato);
};
