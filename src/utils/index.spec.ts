import { numberFormat } from '.';

describe('test number format', () => {
  it('should convert empty string to -', () => {
    expect(numberFormat('' as any)).toEqual('-');
  });

  it('should convert string to -', () => {
    expect(numberFormat('test' as any)).toEqual('-');
  });

  it('should convert undefined to -', () => {
    expect(numberFormat(undefined as any)).toEqual('-');
  });

  it('should convert 1 to 1.00', () => {
    expect(numberFormat(1)).toEqual('1.00');
  });

  it('should convert 1000 to 1000 with comma', () => {
    expect(numberFormat(1000)).toEqual('1,000.00');
  });
  it('should convert 1000000 to 1000000 with comma', () => {
    expect(numberFormat(1000000)).toEqual('1,000,000.00');
  });

  it('should convert 100.561 to 100.56', () => {
    expect(numberFormat(100.561)).toEqual('100.56');
  });
  it('should convert 100.565 to 100.57', () => {
    expect(numberFormat(100.565)).toEqual('100.57');
  });

  it('should convert 100.54 to 100.54', () => {
    expect(numberFormat(100.54)).toEqual('100.54');
  });

  it('should convert -1 to -1.00', () => {
    expect(numberFormat(-1)).toEqual('-1.00');
  });

  it('should do nothing with 1.00 to 1.00', () => {
    expect(numberFormat(1.0)).toEqual('1.00');
  });
});
