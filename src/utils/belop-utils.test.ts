import { describe, expect, it } from 'vitest';
import { formatterBeloep } from './belop-utils.ts';

describe('formatterBeloep()', () => {
  it('skal kunne formattere tallet 0', () => {
    const res = formatterBeloep('0');
    expect(res).toBe('0,00');
  });

  it('skal kunne formattere positive tall', () => {
    const res = formatterBeloep('123.00');
    expect(res).toBe('123,00');
  });
  it('skal kunne formattere store positive tall', () => {
    const res = formatterBeloep('1234567.00');
    expect(res).toBe('1 234 567,00');
  });

  it('skal kunne formattere negative tall', () => {
    const res = formatterBeloep('-234.56');
    expect(res).toBe('−234,56');
  });
  it('skal kunne formattere store negative tall', () => {
    const res = formatterBeloep('-23456.79');
    expect(res).toBe('−23 456,79');
  });

  it('skal kunne formattere tall med flere enn 2 desimaler', () => {
    const res = formatterBeloep('123.4567');
    expect(res).toBe('123,46');
  });

  it('skal returnere "NaN" hvis numberString-argumentet ikke har riktig format', () => {
    const res = formatterBeloep('foo');
    expect(res).toBe('NaN');
  });
});
