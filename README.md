  **AT1C Protocol AI Agentic Registry Verified Accountability**

**Make every AI action accountable to a human—by default.**

Verifiable approval for human and AI actions

Nothing can act on behalf of a user without their approval—and that approval can be proven.

**Why this matters** 
 [Read the Whitepaper](docs/whitepaper.md)

**The approval layer for AI agents and user-controlled identity**

 AT1C Protocol README

Nothing can act on behalf of a user without their approval—and that approval can be proven.

---

 How it works

Request → Approve → Proof → Verify
 Quick Example

const user = await at1c.identify()

const approval = await at1c.request({
  actor: "ai_agent",
  action: "post_content",
  resource: "user://social_account"
})

await at1c.approve(approval)

const proof = await at1c.getProof(approval)

// Any system can verify this
await at1c.verify(proof)

 The Problem

**Today’s systems act on implicit trust:**

Apps act on behalf of users silently

AI agents execute without oversight

Identity is fragmented and platform-controlled

**This leads to:**

Automation without accountability

 The AT1C Solution

**AT1C introduces a new primitive:**

No action is valid unless backed by verifiable user approval

**It adds a simple control layer:**

 User-controlled identity

 Explicit approval before any action


 Verifiable proof of consent

 AI agents gated by human intent

  ** AT1C doesn’t replace existing systems—it wraps them with accountability**

 Try It (30 seconds)

**Right now someone might wonder** “how do I get at1c?”

Clone and run:

git clone https://github.com/alwayshuman/at1c.git
cd at1c
npx ts-node --compiler-options '{"module":"CommonJS"}' examples/login-demo/index.ts

 Demo 1 — Sign in with AT1C

User is identified
Approval is requested
Access granted only after consent
npx ts-node --compiler-options '{"module":"CommonJS"}' examples/login-demo/index.ts

 Demo 2 — AI Agent Approval

AI requests permission
User approves or denies
Action is controlled by the user
npx ts-node --compiler-options '{"module":"CommonJS"}' examples/ai-agent-demo/index.ts

 Documentation

 **AT1C Protocol**
 
 https://github.com/alwayshuman/at1c/blob/main/docs/protocol.md
 
 **AT1C Whitepaper**

 https://github.com/alwayshuman/at1c/blob/main/docs/whitepaper.md

 Core Concept

**AT1C introduces a simple rule:**

Nothing acts on behalf of a user without explicit approval

Upgraded with:

**Every approval is verifiable**

 What This Enables

Safe AI agents (cannot act without permission)

Consent-based authentication (beyond passwords)

Auditable digital actions (who approved what, when)

Human-in-the-loop automation

 Vision

**AT1C can become the standard layer for:**

AI safety & accountability

Secure identity flows

Permission-based automation

Verifiable digital actions

 Project Structure

at1c/
├── docs/          # Protocol + whitepaper
├── packages/      # SDK
├── examples/      # Demos
 Contributing

AT1C is a lightweight approval layer that ensures all actions performed on behalf of a user are explicitly authorized and verifiable.

Core flow:

1. A system requests permission to act
2. The user approves or denies
3. A proof of approval is generated
4. Any system can verify that proof

This enables developers to build applications where actions are not just executed—but accountable.

**Stripe** made payments simple for developers.

**AT1C** does the same for user approval.

Instead of building complex identity and permission systems, developers use AT1C to request, approve, and verify actions with a simple API.

Early-stage protocol. Open to ideas, feedback, and collaboration.

📜 License

MIT

A.Human


