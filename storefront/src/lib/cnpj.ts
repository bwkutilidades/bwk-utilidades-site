export function stripNonDigits(value: string): string {
  return (value ?? "").replace(/\D+/g, "");
}

export function isValidCnpj(value: string): boolean {
  const cnpj = stripNonDigits(value);
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;

  const digits = cnpj.split("").map((d) => Number(d));

  const calcCheckDigit = (base: number[], weights: number[]) => {
    const sum = base.reduce((acc, num, idx) => acc + num * weights[idx], 0);
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const base12 = digits.slice(0, 12);
  const dv1 = calcCheckDigit(base12, weights1);
  if (dv1 !== digits[12]) return false;

  const base13 = digits.slice(0, 13);
  const dv2 = calcCheckDigit(base13, weights2);
  if (dv2 !== digits[13]) return false;

  return true;
}
