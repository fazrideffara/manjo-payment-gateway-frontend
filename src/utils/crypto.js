/**
 * Utilitas untuk menghitung HMAC-SHA256 sesuai standar keamanan.
 * Menggunakan Web Crypto API (SubtleCrypto) bawaan browser.
 */
export async function generateHmac(payload, secret = 'MANJO-SECRET-KEY-2025-PAYMENT-GATEWAY') {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(payload);

    const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await window.crypto.subtle.sign(
        'HMAC',
        cryptoKey,
        messageData
    );

    // Ubah ArrayBuffer ke Hex String
    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
