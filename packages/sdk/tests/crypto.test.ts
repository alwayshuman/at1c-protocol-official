import { describe, it, expect } from 'vitest'
import {
  generateKeyPair,
  signReceipt,
  verifyReceipt,
  buildReceipt,
  canonicalise,
  publicKeyToHex,
  hexToPublicKey,
  ReceiptPayload,
  SignedReceipt,
} from '../src/crypto'

// ─── Helpers ─────────────────────────────────────────────

function makePayload(overrides: Partial<ReceiptPayload> = {}): ReceiptPayload {
  const now = new Date()
  return {
    receiptId: 'test-receipt-001',
    nonce: 'test-nonce-001',
    version: '1.0',
    status: 'approved',
    userId: 'user_test',
    agentId: 'agent_test',
    action: 'send_email',
    timestamp: now.toISOString(),
    expiresAt: new Date(now.getTime() + 300_000).toISOString(),
    ...overrides,
  }
}

// ─── Key Generation ──────────────────────────────────────

describe('generateKeyPair', () => {
  it('generates a keypair with correct byte lengths', () => {
    const { secretKey, publicKey } = generateKeyPair()
    expect(secretKey).toBeInstanceOf(Uint8Array)
    expect(publicKey).toBeInstanceOf(Uint8Array)
    expect(secretKey.length).toBe(32)
    expect(publicKey.length).toBe(32)
  })

  it('generates unique keypairs each time', () => {
    const a = generateKeyPair()
    const b = generateKeyPair()
    expect(publicKeyToHex(a.publicKey)).not.toBe(publicKeyToHex(b.publicKey))
  })
})

// ─── Canonicalise ────────────────────────────────────────

describe('canonicalise', () => {
  it('produces same bytes regardless of key insertion order', () => {
    const payload = makePayload()
    const a = canonicalise(payload)
    const shuffled: ReceiptPayload = {
      expiresAt: payload.expiresAt,
      action: payload.action,
      receiptId: payload.receiptId,
      nonce: payload.nonce,
      agentId: payload.agentId,
      status: payload.status,
      timestamp: payload.timestamp,
      userId: payload.userId,
      version: payload.version,
    }
    const b = canonicalise(shuffled)
    expect(Buffer.from(a).toString('hex')).toBe(Buffer.from(b).toString('hex'))
  })
})

// ─── Sign & Verify ───────────────────────────────────────

describe('signReceipt + verifyReceipt', () => {
  it('signs a receipt and verifies it successfully', () => {
    const { secretKey } = generateKeyPair()
    const payload = makePayload()
    const receipt = signReceipt(payload, secretKey)
    const result = verifyReceipt(receipt)
    expect(result.valid).toBe(true)
  })

  it('fails verification if signature is tampered', () => {
    const { secretKey } = generateKeyPair()
    const receipt = signReceipt(makePayload(), secretKey)
    const tampered: SignedReceipt = {
      ...receipt,
      signature: 'a'.repeat(128),
    }
    const result = verifyReceipt(tampered)
    expect(result.valid).toBe(false)
  })

  it('fails verification if action is tampered', () => {
    const { secretKey } = generateKeyPair()
    const receipt = signReceipt(makePayload(), secretKey)
    const tampered: SignedReceipt = {
      ...receipt,
      action: 'delete_database',
    }
    const result = verifyReceipt(tampered)
    expect(result.valid).toBe(false)
    expect(result.reason).toBe('invalid_signature')
  })

  it('fails verification if userId is tampered', () => {
    const { secretKey } = generateKeyPair()
    const receipt = signReceipt(makePayload(), secretKey)
    const tampered: SignedReceipt = {
      ...receipt,
      userId: 'attacker_999',
    }
    const result = verifyReceipt(tampered)
    expect(result.valid).toBe(false)
    expect(result.reason).toBe('invalid_signature')
  })

  it('fails verification on expired receipt', () => {
    const { secretKey } = generateKeyPair()
    const payload = makePayload({
      expiresAt: new Date(Date.now() - 1000).toISOString(),
    })
    const receipt = signReceipt(payload, secretKey)
    const result = verifyReceipt(receipt)
    expect(result.valid).toBe(false)
    expect(result.reason).toBe('expired')
  })

  it('fails verification if status is denied', () => {
    const { secretKey } = generateKeyPair()
    const payload = makePayload({ status: 'denied' })
    const receipt = signReceipt(payload, secretKey)
    const result = verifyReceipt(receipt)
    expect(result.valid).toBe(false)
    expect(result.reason).toBe('not_approved')
  })
})

// ─── Build Receipt ───────────────────────────────────────

describe('buildReceipt', () => {
  it('builds and returns a valid signed receipt', () => {
    const { secretKey } = generateKeyPair()
    const receipt = buildReceipt(
      {
        userId: 'user_test',
        agentId: 'agent_test',
        action: 'login',
        status: 'approved',
      },
      secretKey
    )
    expect(receipt.receiptId).toBeTruthy()
    expect(receipt.signature).toBeTruthy()
    expect(receipt.publicKey).toBeTruthy()
    const result = verifyReceipt(receipt)
    expect(result.valid).toBe(true)
  })

  it('respects custom ttlSeconds', () => {
    const { secretKey } = generateKeyPair()
    const receipt = buildReceipt(
      {
        userId: 'user_test',
        agentId: 'agent_test',
        action: 'login',
        status: 'approved',
        ttlSeconds: 60,
      },
      secretKey
    )
    const diff =
      new Date(receipt.expiresAt).getTime() -
      new Date(receipt.timestamp).getTime()
    expect(diff).toBe(60_000)
  })
})
describe('replay protection', () => {
  it('blocks a receipt used twice', () => {
    const keys = generateKeyPair()
    const receipt = buildReceipt(
      { userId: 'user_1', agentId: 'agent_1', action: 'test', status: 'approved' },
      keys.secretKey
    )
    const first = verifyReceipt(receipt)
    const second = verifyReceipt(receipt)
    expect(first.valid).toBe(true)
    expect(second.valid).toBe(false)
    expect(second.reason).toBe('replay_detected')
  })
})
