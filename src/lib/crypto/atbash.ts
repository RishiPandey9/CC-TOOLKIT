/**
 * ROT13 and Atbash symmetric reciprocal ciphers
 */

export function rot13(text: string): string {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
  });
}

export function atbash(text: string): string {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const isUpper = char <= 'Z';
    const base = isUpper ? 65 : 97;
    const offset = char.charCodeAt(0) - base;
    return String.fromCharCode(base + (25 - offset));
  });
}
