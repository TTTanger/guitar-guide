// Encrypts a password using a simple Vigenère cipher variant
// Reference: https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher

/**
 * Encrypt data using a simple Vigenère cipher variant.
 * This function takes plain text data and returns an encrypted string.
 * The encryption uses time and only works for printable ASCII characters.
 *
 * @param {string} data - The plain text data to encrypt
 * @returns {string} The encrypted password
 */

export function encrypt(data, time) {
    const key = md5(time).slice(0);

    const dataLen = data.length; // Length of the password
    const keyLen = key.length; // Length of the key
    let encrypted = '';

    // Loop through each character of the password
    for (let i = 0; i < dataLen; i++) {
        const pChar = data[i]; // Current character from the password
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
