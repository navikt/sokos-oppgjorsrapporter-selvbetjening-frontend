import dayjs from 'dayjs';

const datoFormatNorsk = 'DD.MM.YYYY';

export function isoDatoTilNorskDato(date: string | undefined): string {
  if (!date) {
    return '';
  }

  // Try parsing as ISO date (YYYY-MM-DD)
  let parsedDate = dayjs(date, 'YYYY-MM-DD', true);

  // If not valid, try parsing as ISO datetime
  if (!parsedDate.isValid()) {
    parsedDate = dayjs(date);
  }

  return parsedDate.isValid() ? parsedDate.format(datoFormatNorsk) : date;
}
