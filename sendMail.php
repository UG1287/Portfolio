<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

switch ($_SERVER['REQUEST_METHOD']) {
    case 'OPTIONS':
        header("Access-Control-Allow-Methods: POST");
        exit;

    case 'POST':
        $json = file_get_contents('php://input');
        $params = json_decode($json);

        // Grundvalidierung
        if (!isset($params->name, $params->email, $params->message)) {
            http_response_code(400);
            echo json_encode(["error" => "Erforderliche Felder fehlen."]);
            exit;
        }

        $name = trim($params->name);
        $email = trim($params->email);
        $message = trim($params->message);

        // E-Mail validieren
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(["error" => "Ungültige E-Mail-Adresse."]);
            exit;
        }

        if (strlen($name) < 2 || strlen($message) < 10) {
            http_response_code(400);
            echo json_encode(["error" => "Name oder Nachricht zu kurz."]);
            exit;
        }

        // Empfänger-Adresse
        $recipient = "mail@example.com"; // TODO: ersetzen mit deiner echten Adresse
        $subject = "Kontaktformular von <$email>";

        // HTML-Nachricht
        $content = "<strong>Von:</strong> " . htmlspecialchars($name) . "<br><br>";
        $content .= "<strong>Nachricht:</strong><br>" . nl2br(htmlspecialchars($message));

        $headers = [];
        $headers[] = "MIME-Version: 1.0";
        $headers[] = "Content-Type: text/html; charset=utf-8";
        $headers[] = "From: noreply@deine-domain.de";

        $success = mail($recipient, $subject, $content, implode("\r\n", $headers));

        if ($success) {
            echo json_encode(["success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Versand fehlgeschlagen."]);
        }
        break;

    default:
        http_response_code(405);
        header("Allow: POST");
        echo json_encode(["error" => "Nur POST-Anfragen erlaubt."]);
        exit;
}
