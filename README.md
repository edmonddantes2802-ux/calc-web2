# Bold Calculator

Веб-калькулятор в стиле Android-приложения **Calcu**: крупная типографика, высокий контраст, оранжевый акцент. Local-first: работает оффлайн через `localStorage`, опционально синхронизируется с Supabase.

## Стек

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Zustand (+ persist)
- math.js
- Framer Motion
- Supabase JS (опционально)
- Lucide React

## Локальный запуск

```bash
npm install
cp .env.example .env.local   # на Windows: copy .env.example .env.local
npm run dev
```

Приложение откроется на `http://localhost:3000`.

Без переменных Supabase приложение работает полностью на `localStorage` — это штатный режим.

## Supabase (опционально)

1. Создайте проект на [supabase.com](https://supabase.com).
2. В **SQL Editor** выполните `supabase/migrations/001_initial.sql`.
3. В **Project Settings → API** скопируйте `URL` и `anon public key` в `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

После перезапуска `npm run dev` приложение начнёт подгружать темы из БД.

## Структура

```
src/
  app/              Next.js App Router
  components/       UI-компоненты
  core/             Математическое ядро и форматирование (без React)
  hooks/            Кастомные хуки
  store/            Zustand-стейт
  lib/              Внешние клиенты (Supabase)
  types/            TS-типы
supabase/
  migrations/       SQL для инициализации БД
```

## Управление с клавиатуры

| Клавиша | Действие |
| --- | --- |
| `0`–`9`, `.` | Ввод цифры |
| `+`, `-`, `*`, `/` | Оператор |
| `Enter`, `=` | Вычислить |
| `Backspace` | Удалить символ |
| `Escape`, `Delete` | Сбросить (`AC`) |
| `(`, `)` | Скобки |
| `%` | Процент |
