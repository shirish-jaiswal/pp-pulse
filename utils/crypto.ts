import CryptoJS from 'crypto-js';

// In a real app, move this string to an .env file
const SECRET_KEY = "your-very-secure-secret-key";

export const encryptData = (text: string): string => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decryptData = (ciphertext: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || "";
  } catch (error) {
    console.error("Decryption failed", error);
    return "";
  }
};