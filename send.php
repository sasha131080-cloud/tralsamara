<?php
/**
 * Обработчик формы заказа/обратной связи
 * Сайт: ТралСамара — аренда спецтехники и грузоперевозки
 * 
 * Настройка:
 * 1. Укажите свой email в переменной $to
 * 2. Загрузите send.php на хостинг с поддержкой PHP
 * 3. В js/script.js раскомментируйте PHP-блок отправки
 */

$to = "info@tralsamara.ru"; // Замените на ваш email
$subject_prefix = "[ТралСамара]";

function getPost($key, $default = '') {
    return isset($_POST[$key]) ? htmlspecialchars(trim($_POST[$key]), ENT_QUOTES, 'UTF-8') : $default;
}

$form_type = getPost('form_type');

if ($form_type === 'callback') {
    $phone = getPost('phone');
    $name  = getPost('name');
    
    if (empty($phone)) {
        http_response_code(400);
        die(json_encode(['error' => 'Телефон обязателен для заполнения']));
    }
    
    $subject = "$subject_prefix Заказ обратного звонка";
    $message = "
        <h2>Заказ обратного звонка</h2>
        <p><strong>Имя:</strong> $name</p>
        <p><strong>Телефон:</strong> $phone</p>
        <p><strong>Дата:</strong> " . date('d.m.Y H:i') . "</p>
    ";
    
} else {
    $name    = getPost('name');
    $phone   = getPost('phone');
    $service = getPost('service');
    $date    = getPost('date');
    $comment = getPost('comment');
    
    if (empty($phone)) {
        http_response_code(400);
        die(json_encode(['error' => 'Телефон обязателен для заполнения']));
    }
    
    $subject = "$subject_prefix Новая заявка";
    $message = "
        <h2>Новая заявка с сайта</h2>
        <p><strong>Имя:</strong> $name</p>
        <p><strong>Телефон:</strong> $phone</p>
        <p><strong>Услуга:</strong> $service</p>
        <p><strong>Желаемая дата:</strong> $date</p>
        <p><strong>Комментарий:</strong> $comment</p>
        <p><strong>Дата отправки:</strong> " . date('d.m.Y H:i') . "</p>
        <p><strong>IP:</strong> {$_SERVER['REMOTE_ADDR']}</p>
    ";
}

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=utf-8\r\n";
$headers .= "From: ТралСамара <noreply@tralsamara.ru>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($to, $subject, $message, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка при отправке. Попробуйте позже или позвоните нам.']);
}
