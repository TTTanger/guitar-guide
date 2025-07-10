// Encrypts a password using a simple Vigenère cipher variant
// Note: This is for demonstration only and is NOT secure for real-world use
// Reference: https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher

/**
 * Encrypt a password using a simple Vigenère cipher variant.
 * This function takes a plain text password and returns an encrypted string.
 * The encryption uses a static key and only works for printable ASCII characters.
 *
 * @param {string} psw - The plain text password to encrypt
 * @returns {string} The encrypted password
 */
export function encryptPassword(psw) {
    const key = "tanger"; // Static key for encryption
    const pswLen = psw.length; // Length of the password
    const keyLen = key.length; // Length of the key
    let encrypted = '';

    // Loop through each character of the password
    for (let i = 0; i < pswLen; i++) {
        const pChar = psw[i]; // Current character from the password
        const kChar = key[i % keyLen]; // Corresponding character from the key (repeats if needed)

        // Convert characters to offsets (printable ASCII range)
        const pOffset = pChar.charCodeAt(0) - 32;
        const kOffset = kChar.charCodeAt(0) - 32;

        // Vigenère encryption: (plain + key) mod 95 (printable ASCII)
        const cOffset = (pOffset + kOffset) % 95;

        // Convert back to a printable ASCII character and add to result
        encrypted += String.fromCharCode(cOffset + 32);
    }

    return encrypted; // Return the encrypted password
}
