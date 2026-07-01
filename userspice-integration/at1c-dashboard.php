<?php
require_once 'users/init.php';
require_once $abs_us_root.$us_url_root.'users/includes/template/prep.php';

if (!securePage($_SERVER['PHP_SELF'])) { die(); }

$agentData = at1c_get_agents();
?>

<div class="container my-5">
  <h1>AT1C Agent Dashboard</h1>

  <?php if (!empty($agentData['error'])): ?>
    <div class="alert alert-danger">
      Could not reach the AT1C Registry. Please try again later.
    </div>
  <?php else: ?>
    <p>Total registered agents: <strong><?= htmlspecialchars($agentData['count'] ?? 0) ?></strong></p>

    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Agent ID</th>
          <th>Name</th>
          <th>Owner</th>
          <th>Tier</th>
          <th>Permissions</th>
          <th>Status</th>
          <th>Expires</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach (($agentData['agents'] ?? []) as $agent): ?>
        <tr>
          <td><?= htmlspecialchars($agent['agentId']) ?></td>
          <td><?= htmlspecialchars($agent['name'] ?? '—') ?></td>
          <td><?= htmlspecialchars($agent['ownerUserId']) ?></td>
          <td><?= htmlspecialchars($agent['tier'] ?? '—') ?></td>
          <td><?= htmlspecialchars(implode(', ', $agent['permissions'] ?? [])) ?></td>
          <td><?= htmlspecialchars($agent['status']) ?></td>
          <td><?= htmlspecialchars($agent['expiresAt']) ?></td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  <?php endif; ?>
</div>

<?php require_once $abs_us_root.$us_url_root.'users/includes/html_footer.php'; ?>