# Bold Calculator

Веб-калькулятор в стиле Android-приложения **Calcu** с авторизацией через Supabase: история операций синхронизируется в облако и привязана к аккаунту пользователя.

## Стек

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Zustand (+ persist)
- math.js
- Framer Motion
- Supabase (auth + Postgres + RLS)
- Lucide React

## Запуск

```bash
npm install
cp .env.example .env.local      # Windows: copy .env.example .env.local
# заполнить .env.local значениями из Supabase
npm run dev
```

Открывайте `http://localhost:3000`. При первом заходе незалогиненного пользователя — редирект на `/login`.

## Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com).
2. В **SQL Editor** выполните по очереди:
   - `supabase/migrations/001_initial.sql` — таблицы `themes`, `user_history` + RLS.
   - `supabase/migrations/002_profiles.sql` — таблица `profiles` + триггер автосоздания профиля при регистрации.
3. **Project Settings → API** → скопируйте `URL` и `anon public key` в `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. **Authentication → Providers → Email**: для разработки можно отключить «Confirm email», иначе после регистрации потребуется подтверждение по почте.

После изменений `.env.local` перезапустите `npm run dev` — Next кэширует env при старте.

## Маршруты

| Путь | Доступ | Назначение |
| --- | --- | --- |
| `/` | Только для авторизованных | Калькулятор + история |
| `/login` | Только для гостей | Форма входа |
| `/signup` | Только для гостей | Форма регистрации |

`AuthGate` (`src/components/auth/AuthGate.tsx`) выполняет редиректы на стороне клиента и инициализирует Supabase-сессию из `localStorage` через `supabase.auth.getSession()` + подписку на `onAuthStateChange`.

## Поведение истории

- При **входе**: подгружается облачная история из таблицы `user_history`, заменяя локальный кэш.
- При **первом входе** (если в локалсторадже остались записи анонима, а в облаке пусто) — локальные записи мигрируются в облако.
- При **нажатии `=`**: запись добавляется в локальный стор и фоном пушится в `user_history` (fire-and-forget).
- При **выходе**: локальная история и текущее выражение очищаются.

## Структура

```
src/
  app/
    login/          публичная страница входа
    signup/         публичная страница регистрации
    layout.tsx      корневой layout, оборачивает всё в AuthGate
    page.tsx        защищённая страница калькулятора
  components/
    auth/
      AuthForm.tsx  форма для login/signup (один компонент, режим через prop)
      AuthGate.tsx  редиректы и инициализация сессии
      UserMenu.tsx  email + кнопка выхода в шапке
    Calculator.tsx, Display.tsx, Keypad.tsx, ...
  core/             математическое ядро (без React)
  hooks/
  lib/
    auth.ts         signUp/signIn/signOut/getSession/onAuthStateChange + formatAuthError
    supabaseClient.ts
    historySync.ts  load/push/clear/migrate облачной истории
  store/
    useAuthStore.ts    статус сессии, user, инициализация
    useCalculatorStore.ts  состояние калькулятора + история (через мост к auth)
supabase/
  migrations/
    001_initial.sql   themes + user_history + RLS
    002_profiles.sql  profiles + триггер auto-create
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
| `%` | Процент (контекстный: `100 - 10%` = 90) |
