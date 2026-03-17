# Русское Вино — Telegram Mini App

Vue 3 мини-приложение для магазина российских вин [russianvine.ru](https://russianvine.ru).

## Стек

- **Vue 3** + Vite
- **Pinia** — стейт-менеджмент
- **Vue Router 4** — hash-режим для совместимости с TMA
- **Axios** — HTTP-запросы
- **Telegram Web App SDK**
- Backend: Laravel (API на `russianvine.ru/api`)

---

## Разработка (Dev)

### 1. Установить зависимости

```bash
npm install
```

### 2. Запустить dev-сервер

```bash
npm run dev
```

Откроется на `http://localhost:5173`.

> **Важно:** Telegram WebApp SDK не работает вне Telegram. Для тестирования в браузере большинство функций работает, но `window.Telegram.WebApp` будет `undefined` — это нормально, приложение это обрабатывает.

### 3. Тестирование в Telegram

Используй [ngrok](https://ngrok.com) чтобы сделать локальный сервер доступным извне:

```bash
ngrok http 5173
```

Полученный `https://xxxx.ngrok.io` укажи как Web App URL в [@BotFather](https://t.me/BotFather).

---

## Продакшн (Prod)

### 1. Собрать проект

```bash
npm run build
```

Готовые файлы окажутся в папке `dist/`.

### 2. Загрузить на сервер

Содержимое папки `dist/` загрузить на хостинг (например в `public_html` или отдельный домен/поддомен).

Пример через `scp`:

```bash
scp -r dist/* user@yourserver.com:/var/www/mini-app/
```

Или через FTP/FileZilla — загрузить содержимое `dist/` в нужную папку.

### 3. Nginx (если нужен конфиг)

```nginx
server {
    listen 80;
    server_name mini.russianvine.ru;

    root /var/www/mini-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 4. Зарегистрировать Web App в боте

1. Открыть [@BotFather](https://t.me/BotFather)
2. Выбрать своего бота → **Bot Settings → Menu Button → Edit Menu Button URL**
3. Вставить URL задеплоенного приложения

---

## Backend — что нужно задеплоить

После изменений в Laravel-проекте (`russian-wine`) необходимо:

```bash
# На сервере
php artisan migrate        # добавляет user_id в таблицу orders
php artisan config:cache
php artisan route:cache
```

Изменённые файлы Laravel:
- `app/Http/Controllers/API/WineController.php` — фильтры + поиск + фильтр по винодельне
- `app/Http/Controllers/API/OrderController.php` — привязка заказа к юзеру + Telegram уведомление
- `app/Models/Order.php` — связь с User
- `database/migrations/2026_03_17_000001_add_user_id_to_orders_table.php`

---

## Переменные окружения

В Laravel `.env` должен быть:

```
TELEGRAM_BOT_TOKEN=ваш_токен_бота
```
