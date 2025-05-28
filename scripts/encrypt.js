export function encryptPassword(psw) {
    const key = "tanger";
    const pswLen = psw.length;
    const keyLen = key.length;
    let encrypted = '';

    for (let i = 0; i < pswLen; i++) {
        const pChar = psw[i];
        const kChar = key[i % keyLen];

        const pOffset = pChar.charCodeAt(0) - 32;
        const kOffset = kChar.charCodeAt(0) - 32;

        // Vigenère encryption
        const cOffset = (pOffset + kOffset) % 95;

        encrypted += String.fromCharCode(cOffset + 32);
    }

    return encrypted;
}
