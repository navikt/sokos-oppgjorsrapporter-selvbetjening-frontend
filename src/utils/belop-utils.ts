export function formatterBeloep(numberString: string): string {
  return (
    new Intl.NumberFormat('no', {
      style: 'currency',
      currency: 'NOK',
    })
      // @ts-expect-error: `numberString`-parameteret til denne funksjonen skal
      //                   i praksis være en string hvis innhold er noe som ser
      //                   ut som et `number` med 2 desimaler.  Dette er ugreit
      //                   å få uttrykt som en type; vi har jo ikke noen
      //                   `StringNumericLiteral` her.
      //                   Så lenge `numberString`-innholdet er som beskrevet,
      //                   så fungerer dette kallet fint.
      .formatToParts(numberString)
      .filter((part) => part.type !== 'currency')
      .map((part) => part.value)
      .join('')
      .trim()
  );
}
