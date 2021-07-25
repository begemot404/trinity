<?php

if (!$_POST) exit('No direct script access allowed');

if (!isset($_POST['f'])) exit('No direct script access allowed');
if (!isset($_POST['f']['name'])) exit('No direct script access allowed');
if (!isset($_POST['f']['email'])) exit('No direct script access allowed');

$email = trim(strip_tags($_POST['f']['email']));
$name = trim(strip_tags($_POST['f']['name']));

if (!filter_var($email, FILTER_VALIDATE_EMAIL))
{
	exit('Неверный email! Обновите страницу (F5) и укажите правильный адрес');
}

if (!$name)
{
	exit('Не указано имя! Обновите страницу (F5) и укажите своё имя');
}


$to = 'artemgajcuk@gmail.com'; // адрес получателя

$subject = 'Тема письма'; // тема письма

// формируем тело сообщения
$message = 'Имя: ' . $name . "\r\n" . 'Email: ' . $email; 

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