<?php
/*
UserSpice 5
An Open Source PHP User Management System
by the UserSpice Team at http://UserSpice.com

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
//Put your custom functions in this file and they will be automatically included.
//bold("<br><br>custom helpers included");

// ── AT1C Registry connection ────────────────────────────────────────────────
define('AT1C_REGISTRY_URL', 'https://registry.at1c.com');
define(define('AT1C_API_KEY', 'YOUR_API_KEY_HERE'); // Set in cPanel env or replace locally — never commit real key);

function at1c_get_agents() {
    $ch = curl_init(AT1C_REGISTRY_URL . '/agents');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'x-api-key: ' . AT1C_API_KEY
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        return ['error' => true, 'message' => 'Registry unreachable'];
    }
    return json_decode($response, true);
}
