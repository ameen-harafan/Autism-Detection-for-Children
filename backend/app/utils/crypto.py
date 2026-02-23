"""
Cryptography utilities for PIN-based encryption.
"""
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
import hashlib
import os
import base64


def derive_key(pin: str) -> bytes:
    """Derive a 32-byte key from PIN using SHA-256."""
    return hashlib.sha256(pin.encode()).digest()


def encrypt_data(data: str, pin: str) -> str:
    """
    Encrypt data using AES-256-CBC with PIN-derived key.
    Returns base64-encoded encrypted data.
    """
    key = derive_key(pin)
    iv = os.urandom(16)  # 16 bytes for AES block size
    
    # Pad the data
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(data.encode())
    padded_data += padder.finalize()
    
    # Encrypt
    cipher = Cipher(
        algorithms.AES(key),
        modes.CBC(iv),
        backend=default_backend()
    )
    encryptor = cipher.encryptor()
    encrypted = encryptor.update(padded_data) + encryptor.finalize()
    
    # Combine IV and encrypted data, then base64 encode
    combined = iv + encrypted
    return base64.b64encode(combined).decode()


def decrypt_data(encrypted_data: str, pin: str) -> str:
    """
    Decrypt data using AES-256-CBC with PIN-derived key.
    Expects base64-encoded encrypted data.
    """
    try:
        combined = base64.b64decode(encrypted_data)
        iv = combined[:16]
        encrypted = combined[16:]
        
        key = derive_key(pin)
        
        # Decrypt
        cipher = Cipher(
            algorithms.AES(key),
            modes.CBC(iv),
            backend=default_backend()
        )
        decryptor = cipher.decryptor()
        padded_data = decryptor.update(encrypted) + decryptor.finalize()
        
        # Unpad
        unpadder = padding.PKCS7(128).unpadder()
        data = unpadder.update(padded_data)
        data += unpadder.finalize()
        
        return data.decode()
    except Exception as e:
        raise ValueError(f"Decryption failed: {str(e)}")

