import * as fs from 'fs'
import * as path from 'path'
import {
  generateKeyPair,
  publicKeyToHex,
  secretKeyToHex,
  hexToPublicKey,
  hexToSecretKey,
  KeyPair,
} from './crypto'

export interface StoredKeyPair {
  publicKey: string
  secretKey: string
  createdAt: string
}

// Generates a new keypair and saves it to disk as JSON
export function saveKeyPair(filePath: string, keyPair: KeyPair): void {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const stored: StoredKeyPair = {
    publicKey: publicKeyToHex(keyPair.publicKey),
    secretKey: secretKeyToHex(keyPair.secretKey),
    createdAt: new Date().toISOString(),
  }

  fs.writeFileSync(filePath, JSON.stringify(stored, null, 2), { mode: 0o600 })
  console.log(`🔑 Keys saved to ${filePath}`)
}

// Loads a keypair from disk
export function loadKeyPair(filePath: string): KeyPair {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Key file not found: ${filePath}`)
  }

  const stored: StoredKeyPair = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

  return {
    publicKey: hexToPublicKey(stored.publicKey),
    secretKey: hexToSecretKey(stored.secretKey),
  }
}

// Loads existing keypair or generates and saves a new one
export function loadOrCreateKeyPair(filePath: string): KeyPair {
  if (fs.existsSync(filePath)) {
    console.log(`🔑 Loaded existing keys from ${filePath}`)
    return loadKeyPair(filePath)
  }

  console.log(`🔑 No keys found — generating new keypair...`)
  const keyPair = generateKeyPair()
  saveKeyPair(filePath, keyPair)
  return keyPair
}

// Returns just the public key hex from a key file
export function getPublicKeyFromFile(filePath: string): string {
  const stored: StoredKeyPair = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  return stored.publicKey
}
