import CryptoJS from 'crypto-js';
const key = '12345678901234567890123456789012';

export function decrypt(ivHex: string, encryptedHex: string) {
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const encrypted = CryptoJS.enc.Hex.parse(encryptedHex);
    const encryptedBase64 = CryptoJS.enc.Base64.stringify(encrypted);

    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, CryptoJS.enc.Utf8.parse(key), {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
}
