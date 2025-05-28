<?php
function decrypt_password($encrypted_psw) {
    $key = "tanger";
    $encrypted_len = strlen($encrypted_psw);
    $key_len = strlen($key);
    $decrypted = '';

    for ($i = 0; $i < $encrypted_len; $i++) {
        $c_char = $encrypted_psw[$i];
        $k_char = $key[$i % $key_len];

        $c_offset = ord($c_char) - 32;
        $k_offset = ord($k_char) - 32;

        // Vigenère dycryption
        $p_offset = ($c_offset - $k_offset + 95) % 95;

        $decrypted .= chr($p_offset + 32);
    }

    return $decrypted;
}
?>