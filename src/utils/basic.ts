import jwt from 'jsonwebtoken';

export function getLastDigitOfSum(pana: string): string {
  if (pana === '***') return '*';
  const sum = pana
    .split('')
    .map(Number)
    .reduce((acc, digit) => acc + digit, 0);
  return (sum % 10).toString();
}

export const getTokenFromLocalStorage = (): string | null => {
  if (typeof window === 'undefined' || !window.localStorage) {
    console.error('This function runs only in the browser environment.');
    return null;
  }
  const token = localStorage.getItem('token');
  return token ? token : null;
};

export const getUserIdFromToken = (): string | null => {
  const token = getTokenFromLocalStorage();
  if (!token) return null;

  try {
    const decoded = jwt.decode(token) as { sub: string };
    return decoded.sub;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

export const generateTxnId = (): string => {
  return Math.random().toString(36).substr(2, 10).toUpperCase(); // Random alphanumeric, uppercase, 10 characters
};
