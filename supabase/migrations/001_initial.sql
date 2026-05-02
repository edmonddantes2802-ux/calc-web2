-- Bold Calculator: initial schema

create table if not exists public.themes (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    colors jsonb not null,
    created_at timestamptz default now()
);

create table if not exists public.user_history (
    id bigint generated always as identity primary key,
    expression text not null,
    result text not null,
    user_id uuid references auth.users(id) on delete cascade,
    created_at timestamptz default now()
);

create index if not exists idx_history_user_id on public.user_history(user_id);
create index if not exists idx_history_created_at on public.user_history(created_at desc);

alter table public.themes enable row level security;
alter table public.user_history enable row level security;

drop policy if exists "Themes are viewable by everyone" on public.themes;
create policy "Themes are viewable by everyone"
    on public.themes for select
    using (true);

drop policy if exists "Users can view own history" on public.user_history;
create policy "Users can view own history"
    on public.user_history for select
    using (auth.uid() = user_id);

drop policy if exists "Users can insert own history" on public.user_history;
create policy "Users can insert own history"
    on public.user_history for insert
    with check (auth.uid() = user_id);

drop policy if exists "Users can delete own history" on public.user_history;
create policy "Users can delete own history"
    on public.user_history for delete
    using (auth.uid() = user_id);

insert into public.themes (name, colors)
select 'Bold Dark', '{"bg":"#000000","btn_num":"#1A1A1A","btn_op":"#2F2F2F","btn_accent":"#FF9500","text":"#FFFFFF"}'::jsonb
where not exists (select 1 from public.themes where name = 'Bold Dark');

insert into public.themes (name, colors)
select 'Bold Neon', '{"bg":"#000000","btn_num":"#0F0F0F","btn_op":"#1A1A1A","btn_accent":"#32D74B","text":"#FFFFFF"}'::jsonb
where not exists (select 1 from public.themes where name = 'Bold Neon');
