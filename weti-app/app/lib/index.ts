export const parseBalance = (unParsedBalance: string, decimals: number) => {
  const balanceBigInt = BigInt(unParsedBalance); // Convert string to BigInt
  const decimalFactor = BigInt(10 ** decimals); // Create BigInt for the decimal factor
  return Number(balanceBigInt) / Number(decimalFactor); // Convert back to Number for division
};