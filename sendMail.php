<?php
/**
 * sendMail.php – kompakter, robuster Mail-Endpoint für Shared Hosting
 * - JSON (auch bei text/plain) & x-www-form-urlencoded
 * - Nur POST, klare Statuscodes
 * - Sichere Header, Validation, Honeypot
 * - From = eigene Domain, Reply-To = Absender
 * - Optional CORS und kleines IP-Rate-Limit
 */

/* === KONFIG === */
const TO_EMAIL      = 'hello@ugursay-puercek.com'; // <-- Zieladresse anpassen
const FROM_EMAIL    = 'noreply@ugursay-puercek.com';     // <-- existierende Absenderadresse deiner Domain
const SITE_SUBJECT  = 'Kontaktformular – ugursay-puercek.com';

// CORS: Nur einschalten, wenn Frontend auf *anderer* Origin läuft.
// Beispiel: 'https://portfolio.example.com' oder '*' (nicht empfohlen).
const CORS_ALLOW_ORIGIN = ''; // z.B. 'https://ugursay-puercek.com' oder leer lassen, wenn same-origin

// Spam-Drossel: Minimalabstand (Sekunden) zwischen zwei Anfragen derselben IP.
const RATE_LIMIT_SECONDS = 30; // 0 = deaktiviert

/* === Hilfen === */
function cors_maybe() {
  if (CORS_ALLOW_ORIGIN !== '') {
    header('Access-Control-Allow-Origin: ' . CORS_ALLOW_ORIGIN);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
  }
}

function rate_limit_check(): bool {
  if (RATE_LIMIT_SECONDS <= 0) return true;
  $ip   = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
  $key  = preg_replace('/[^a-zA-Z0-9_.-]/', '_', $ip);
  $file = sys_get_temp_dir() . "/mail_throttle_{$key}.txt";

  $now = time();
  if (is_file($file)) {
    $last = (int) @file_get_contents($file);
    if ($last && ($now - $last) < RATE_LIMIT_SECONDS) {
      return false;
    }
  }
  @file_put_contents($file, (string)$now, LOCK_EX);
  return true;
}

function clean_header_text(string $v): string {
  // Entfernt CR/LF um Header-Injection zu verhindern
  return trim(str_replace(["\r", "\n"], '', $v));
}

function read_payload(): array {
  // 1) Roh-Body (JSON oder „text/plain“ mit JSON)
  $raw = file_get_contents('php://input');
  if ($raw !== false && $raw !== '') {
    $data = json_decode($raw, true);
    if (is_array($data)) return $data;
  }
  // 2) Fallback: klassische Form-Daten (Content-Type: application/x-www-form-urlencoded)
  if (!empty($_POST)) return $_POST;

  return [];
}

/* === Ablauf === */
header('Content-Type: text/plain; charset=utf-8');
cors_maybe();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  // Preflight nur beantworten, wenn CORS aktiv ist
  if (CORS_ALLOW_ORIGIN !== '') { http_response_code(204); exit; }
  http_response_code(405); echo "Method Not Allowed"; exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('Allow: POST', true, 405);
  echo 'Method Not Allowed';
  exit;
}

if (!rate_limit_check()) {
  http_response_code(429);
  echo 'Too Many Requests';
  exit;
}

$data = read_payload();
if (!$data) {
  http_response_code(400);
  echo 'Empty or invalid payload';
  exit;
}

// Felder holen & säubern
$name     = trim((string)($data['name'] ?? ''));
$email    = trim((string)($data['email'] ?? ''));
$message  = trim((string)($data['message'] ?? ''));
$honeypot = trim((string)($data['honeypot'] ?? ''));

// Honeypot: Wenn gefüllt → Bot
if ($honeypot !== '') {
  http_response_code(204); // stillschweigend ignorieren
  exit;
}

// Minimale Validierung
if ($name === '' || mb_strlen($name) < 2) {
  http_response_code(422); echo 'Invalid name'; exit;
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422); echo 'Invalid email'; exit;
}
if ($message === '' || mb_strlen($message) < 10) {
  http_response_code(422); echo 'Message too short'; exit;
}

// Header-sicher machen
$from    = clean_header_text(FROM_EMAIL);
$replyTo = clean_header_text(sprintf('%s <%s>', $name, $email));

// Mail zusammenbauen
$subject = SITE_SUBJECT;
$body    = "Name: {$name}\nE-Mail: {$email}\n\nNachricht:\n{$message}\n";

$headers = [
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'Content-Transfer-Encoding: 8bit',
  'X-Mailer: PHP/' . phpversion(),
  "From: {$from}",
  "Reply-To: {$replyTo}",
];

// Senden
$ok = @mail(
  TO_EMAIL,
  '=?UTF-8?B?' . base64_encode($subject) . '?=',
  $body,
  implode("\r\n", $headers)
);

if ($ok) {
  http_response_code(200);
  echo 'OK';
} else {
  http_response_code(500);
  echo 'Send failed';
}
