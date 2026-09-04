<?php
require_once 'init.php';
require_once $abs_us_root.$us_url_root.'users/includes/template/prep.php';

if (!securePage($_SERVER['PHP_SELF'])) { die(); }

$errors = [];
$success = null;

if (!empty($_POST)) {
    $token = $_POST['csrf'] ?? '';
    if (!Token::check($token)) {
        $errors[] = 'Invalid form token. Please try again.';
    } else {
        $name        = trim($_POST['agent_name'] ?? '');
        $pubkey      = trim($_POST['pubkey'] ?? '');
        $permissions = $_POST['permissions'] ?? [];
        $tier        = 'free';

        if (!$name)              $errors[] = 'Agent name is required.';
        if (!$pubkey)            $errors[] = 'Public key is required.';
        if (empty($permissions)) $errors[] = 'At least one permission is required.';

        if (empty($errors)) {
            $owner = $user->data()->username;
            $perms = array_map('trim', (array)$permissions);

            $payload = json_encode([
                'pubkey'      => $pubkey,
                'name'        => $name,
                'owner'       => $owner,
                'permissions' => $perms,
                'tier'        => $tier,
            ]);

            $ch = curl_init(AT1C_REGISTRY_URL . '/register');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'x-api-key: ' . AT1C_API_KEY,
            ]);
            curl_setopt($ch, CURLOPT_TIMEOUT, 15);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            $result = json_decode($response, true);

            if ($httpCode === 201) {
                $success = $result;
            } elseif ($httpCode === 409) {
                $errors[] = 'This public key is already registered. Agent ID: ' . ($result['agentId'] ?? 'unknown');
            } else {
                $errors[] = 'Registration failed: ' . ($result['error'] ?? 'Unknown error');
            }
        }
    }
}
?>

<div class="container my-5" style="max-width:640px">
  <h1>Register an AT1C Agent</h1>
  <p class="text-muted mb-4">Register your AI agent with the AT1C Registry. Your private key never leaves your device.</p>

  <?php if ($success): ?>
    <div class="alert alert-success">
      <strong>Agent registered successfully.</strong><br>
      Agent ID: <code><?= htmlspecialchars($success['agentId']) ?></code><br>
      Name: <?= htmlspecialchars($success['name']) ?><br>
      Tier: <?= htmlspecialchars($success['tier']) ?><br>
      Issued: <?= htmlspecialchars($success['issuedAt']) ?><br>
      Expires: <?= htmlspecialchars($success['expiresAt']) ?>
    </div>
    <a href="at1c-dashboard.php" class="btn btn-primary">View your agents</a>
  <?php else: ?>

    <?php if ($errors): ?>
      <div class="alert alert-danger">
        <?php foreach ($errors as $e): ?>
          <div><?= htmlspecialchars($e) ?></div>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>

    <div class="border p-4 bg-body-tertiary rounded">
      <form method="post" action="">
        <input type="hidden" name="csrf" value="<?= Token::generate() ?>">

        <!-- Agent Name -->
        <div class="mb-3">
          <label class="form-label"><strong>Agent Name</strong></label>
          <input type="text" name="agent_name" class="form-control"
            placeholder="e.g. My Payment Agent"
            value="<?= htmlspecialchars($_POST['agent_name'] ?? '') ?>">
        </div>

        <!-- Keypair Generation -->
        <div class="mb-3">
          <label class="form-label"><strong>Agent Keypair</strong></label>

          <div id="at1c-keygen-panel">
            <button type="button" id="at1c-generate-btn" class="btn btn-outline-primary">
              Generate Agent Keypair
            </button>
            <div id="at1c-unsupported" class="alert alert-warning mt-2" style="display:none">
              Your browser does not support secure key generation. Please use a recent version of Chrome, Firefox, or Safari.
            </div>
          </div>

          <div id="at1c-key-result" style="display:none" class="mt-3">
            <label class="form-label"><strong>Public Key (will be registered)</strong></label>
            <textarea id="at1c-pubkey-display" class="form-control font-monospace" rows="3" readonly></textarea>

            <div class="alert alert-warning mt-2">
              <strong>Download your private key now.</strong> It is never sent to AT1C or stored anywhere. If you lose it you cannot recover this agent.
            </div>
            <button type="button" id="at1c-download-btn" class="btn btn-secondary">
              Download Private Key
            </button>

            <div class="form-check mt-3">
              <input class="form-check-input" type="checkbox" id="at1c-confirm-saved">
              <label class="form-check-label" for="at1c-confirm-saved">
                I have downloaded and safely stored my private key
              </label>
            </div>
          </div>
        </div>

        <!-- Hidden pubkey field -->
        <input type="hidden" name="pubkey" id="at1c-pubkey-hidden" value="">

        <!-- Permissions Checkboxes -->
        <div class="mb-3">
          <label class="form-label"><strong>Permissions</strong></label>
          <small class="text-muted d-block mb-2">Select what this agent is permitted to do.</small>
          <div class="row">
            <div class="col-6">
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" name="permissions[]" value="send_payment" id="perm_send_payment">
                <label class="form-check-label" for="perm_send_payment">💳 Send payment</label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" name="permissions[]" value="read_balance" id="perm_read_balance">
                <label class="form-check-label" for="perm_read_balance">📊 Read balance</label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" name="permissions[]" value="read_data" id="perm_read_data">
                <label class="form-check-label" for="perm_read_data">📂 Read data</label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" name="permissions[]" value="write_data" id="perm_write_data">
                <label class="form-check-label" for="perm_write_data">✏️ Write data</label>
              </div>
            </div>
            <div class="col-6">
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" name="permissions[]" value="send_email" id="perm_send_email">
                <label class="form-check-label" for="perm_send_email">📧 Send email</label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" name="permissions[]" value="schedule_appointment" id="perm_schedule">
                <label class="form-check-label" for="perm_schedule">📅 Schedule appointment</label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" name="permissions[]" value="file_document" id="perm_file_doc">
                <label class="form-check-label" for="perm_file_doc">📄 File document</label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" name="permissions[]" value="execute_trade" id="perm_trade">
                <label class="form-check-label" for="perm_trade">📈 Execute trade</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Tier -->
        <div class="mb-4">
          <label class="form-label"><strong>Tier</strong></label>
          <input type="text" class="form-control" value="Free" readonly>
          <small class="text-muted">Paid tiers coming soon.</small>
        </div>

        <button type="submit" class="btn btn-primary" id="at1c-submit-btn" disabled>Register Agent</button>
        <a href="at1c-dashboard.php" class="btn btn-secondary ms-2">Cancel</a>
      </form>
    </div>
  <?php endif; ?>
</div>

<script type="module">
import { ml_dsa65 } from 'https://esm.sh/@noble/post-quantum@0.2.1/ml-dsa.js';

function bufToHex(buf) {
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

let generatedPrivateKeyHex = null;

document.getElementById('at1c-generate-btn').addEventListener('click', async () => {
  try {
    const seed = crypto.getRandomValues(new Uint8Array(32));
    const keys = ml_dsa65.keygen(seed);

    const pubkeyHex = bufToHex(keys.publicKey);
    generatedPrivateKeyHex = bufToHex(keys.secretKey);

    document.getElementById('at1c-pubkey-display').value = pubkeyHex;
    document.getElementById('at1c-pubkey-hidden').value  = pubkeyHex;
    document.getElementById('at1c-key-result').style.display = 'block';
    document.getElementById('at1c-generate-btn').disabled = true;
  } catch (err) {
    console.error('ML-DSA-65 key generation failed:', err);
    document.getElementById('at1c-unsupported').style.display = 'block';
  }
});

document.getElementById('at1c-download-btn').addEventListener('click', () => {
  const data = JSON.stringify({
    privateKey: generatedPrivateKeyHex,
    publicKey:  document.getElementById('at1c-pubkey-display').value,
    algorithm:  'ML-DSA-65',
    standard:   'NIST FIPS 204',
    generated:  new Date().toISOString(),
    warning:    'Keep this file private. AT1C never has a copy of your private key.'
  }, null, 2);

  const blob = new Blob([data], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'at1c-agent-key.json';
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('at1c-confirm-saved').addEventListener('change', (e) => {
  document.getElementById('at1c-submit-btn').disabled = !e.target.checked;
});
</script>
<?php require_once $abs_us_root.$us_url_root.'users/includes/html_footer.php'; ?>
