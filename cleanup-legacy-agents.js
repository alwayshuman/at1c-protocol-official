#!/usr/bin/env node
/**
 * AT1C Agent Registry Cleanup
 * One-time fix for legacy custodial agent records:
 *   - agent_3678c68b: referenced by an existing receipt, so kept but
 *     stripped of its privateKey field (the actual security fix).
 *   - agent_55e0e5c04b24: not referenced anywhere else, removed entirely
 *     (it was a test registration from before the custody fix).
 *
 * Usage:
 *   node cleanup-legacy-agents.js          (dry run — shows what would change)
 *   node cleanup-legacy-agents.js --apply  (writes the change to agents.json)
 */

const fs   = require('fs')
const path = require('path')

const AGENTS_FILE = path.join(__dirname, 'agents.json')
const apply        = process.argv.includes('--apply')

const STRIP_PRIVATE_KEY_FROM = 'agent_3678c68b'
const REMOVE_ENTIRELY        = 'agent_55e0e5c04b24'

const agents = JSON.parse(fs.readFileSync(AGENTS_FILE, 'utf-8'))

let strippedCount = 0
let removedCount  = 0

const updated = agents
  .filter(a => {
    if (a.agentId === REMOVE_ENTIRELY) {
      removedCount++
      console.log(`  ➖ Removing ${a.agentId} (${a.name || 'unnamed'}) — not referenced elsewhere`)
      return false
    }
    return true
  })
  .map(a => {
    if (a.agentId === STRIP_PRIVATE_KEY_FROM && 'privateKey' in a) {
      const { privateKey, ...rest } = a
      strippedCount++
      console.log(`  🔑 Stripping privateKey from ${a.agentId} — kept (referenced in receipts.json)`)
      return rest
    }
    return a
  })

console.log('')
console.log(`Summary: ${strippedCount} key(s) stripped, ${removedCount} record(s) removed.`)

if (!apply) {
  console.log('')
  console.log('Dry run only — nothing was written. Re-run with --apply to save changes.')
  process.exit(0)
}

fs.writeFileSync(AGENTS_FILE, JSON.stringify(updated, null, 2))
console.log('')
console.log(`✅ agents.json updated and saved.`)
