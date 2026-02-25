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
