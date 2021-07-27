<?php

if (!$_POST) exit('No direct script access allowed');

if (!isset($_POST['f'])) exit('No direct script access allowed');
if (!isset($_POST['f']['email'])) exit('No direct script access allowed');

$firstname = trim(strip_tags($_POST['f']['firstname']));
$lastname = trim(strip_tags($_POST['f']['lastname']));
$company = trim(strip_tags($_POST['f']['company']));
$email = trim(strip_tags($_POST['f']['email']));
$phone = trim(strip_tags($_POST['f']['phone']));
$message = trim(strip_tags($_POST['f']['message']));

if (!filter_var($email, FILTER_VALIDATE_EMAIL))
{
	exit('Неверный email! Обновите страницу (F5) и укажите правильный адрес');
}

if (!$name)
{
	exit('Не указано имя! Обновите страницу (F5) и укажите своё имя');
}
 

$to = 'business@aitrinity.net'; // адрес получателя

$subject = 'Contact Us | AI TRINITY'; // тема письма

// формируем тело сообщения
$message = 'First name: ' . $firstname . "\r\n" . ' Last name: ' . $lastname . "\r\n" . ' Company: ' . $company . "\r\n" . ' Email: ' . $email . "\r\n" . ' Phone: ' . $phone . "\r\n" . ' Message: ' . $message . "\r\n" . ' '; 

// формируем headers для письма
$headers = 'From: '. $email . "\r\n"; // от кого
 
// кодируем заголовок в UTF-8
$subject = preg_replace("/(\r\n)|(\r)|(\n)/", "", $subject);
$subject = preg_replace("/(\t)/", " ", $subject);
$subject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
	
// отправка
@mail($to, $subject, $message, $headers);

echo 'Спасибо, ваше сообщение отправлено!';

# end of file