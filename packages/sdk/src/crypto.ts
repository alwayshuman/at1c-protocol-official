import * as ed from '@noble/ed25519'
import { sha512 } from '@noble/hashes/sha2.js'

ed.etc.sha512Sync = sha512
const _usedNonces = new Set<string>()
export interface KeyPair {
  secretKey: Uint8Array
  publicKey: Uint8Array
}

export interface ReceiptPayload {
  receiptId: string
  nonce: string
  version: string
  status: 'approved' | 'denied'
  userId: string
  agentId: string
  action: string
  timestamp: string
  expiresAt: string
  // Reserved fields — v2.x principal lifecycle management
  // Enables agent inheritance, dissolution triggers, and zombie corp protection
  // Leave undefined for v1.x; verifiers must ignore unknown fields
  principalValidUntil?: string        // ISO timestamp — principal authority expires at this time
  dissolutionTrigger?: string         // Event that invalidates this agent: 'principal_deceased' | 'entity_dissolved' | 'key_revoked'
  inheritorAgentId?: string           // Agent ID that inherits authority on trigger event
  postDissolutionPolicy?: 'reject' | 'warn' | 'audit_only'  // Verifier behaviour after dissolution
}
export interface SignedReceipt extends ReceiptPayload {
  signature: string
  publicKey: string
}

export function generateKeyPair(): KeyPair {
  const secret = require("crypto").randomBytes(32)
  const publicKey = ed.getPublicKey(secret)
  return { secretKey: secret, publicKey }
}

export function publicKeyToHex(publicKey: Uint8Array): string {
  return Buffer.from(publicKey).toString('hex')
}

export function hexToPublicKey(hex: string): Uint8Array {
  return Uint8Array.from(Buffer.from(hex, 'hex'))
}

export function secretKeyToHex(secretKey: Uint8Array): string {
  return Buffer.from(secretKey).toString('hex')
}

export function hexToSecretKey(hex: string): Uint8Array {
  return Uint8Array.from(Buffer.from(hex, 'hex'))
}

export function canonicalise(payload: ReceiptPayload): Uint8Array {
  const sorted = Object.keys(payload)
    .sort()
    .reduce((acc: Record<string, unknown>, key) => {
      acc[key] = (payload as unknown as Record<string, unknown>)[key]
      return acc
    }, {})
  return new TextEncoder().encode(JSON.stringify(sorted))
}

export function signReceipt(
  payload: ReceiptPayload,
  secretKey: Uint8Array
): SignedReceipt {
  const bytes = canonicalise(payload)
  const sigBytes = ed.sign(bytes, secretKey)
  const publicKey = ed.getPublicKey(secretKey)
  return {
    ...payload,
    signature: Buffer.from(sigBytes).toString('hex'),
    publicKey: Buffer.from(publicKey).toString('hex'),
  }
}

export interface VerifyResult {
  valid: boolean
  reason?: string
}

export function verifyReceipt(receipt: SignedReceipt): VerifyResult {
  const now = new Date()
  const expiresAt = new Date(receipt.expiresAt)
  if (now > expiresAt) {
    return { valid: false, reason: 'expired' }
  }
  if (receipt.status !== 'approved') {
    return { valid: false, reason: 'not_approved' }
  }
  try {
    const payload: ReceiptPayload = {
      receiptId: receipt.receiptId,
      nonce: receipt.nonce,
      version: receipt.version,
      status: receipt.status,
      userId: receipt.userId,
      agentId: receipt.agentId,
      action: receipt.action,
      timestamp: receipt.timestamp,
      expiresAt: receipt.expiresAt,
    }
    const bytes = canonicalise(payload)
    const sigBytes = Uint8Array.from(Buffer.from(receipt.signature, 'hex'))
    const pubKeyBytes = hexToPublicKey(receipt.publicKey)
    const valid = ed.verify(sigBytes, bytes, pubKeyBytes)
    if (!valid) {
      return { valid: false, reason: 'invalid_signature' }
    }
  } catch {
    return { valid: false, reason: 'malformed_receipt' }
  }
 if (_usedNonces.has(receipt.nonce)) return { valid: false, reason: 'replay_detected' }
  _usedNonces.add(receipt.nonce)  
  return { valid: true }
}

export function buildReceipt(
  config: {
    userId: string
    agentId: string
    action: string
    status: 'approved' | 'denied'
    ttlSeconds?: number
  },
  secretKey: Uint8Array
): SignedReceipt {
  const now = new Date()
  const ttl = config.ttlSeconds ?? 300
  const payload: ReceiptPayload = {
    receiptId: crypto.randomUUID(),
    nonce: crypto.randomUUID(),
    version: '1.0',
    status: config.status,
    userId: config.userId,
    agentId: config.agentId,
    action: config.action,
    timestamp: now.toISOString(),
    expiresAt: new Date(now.getTime() + ttl * 1000).toISOString(),
  }
  return signReceipt(payload, secretKey)
}
