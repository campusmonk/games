create table if not exists public.daily_limit_settings (
  id text primary key,
  games_per_day integer check (games_per_day is null or games_per_day >= 0),
  communication_per_day integer check (communication_per_day is null or communication_per_day >= 0),
  debug_per_day integer check (debug_per_day is null or debug_per_day >= 0),
  quiz_per_day integer check (quiz_per_day is null or quiz_per_day >= 0),
  updated_at timestamptz not null default now()
);

alter table public.daily_limit_settings
add column if not exists debug_per_day integer check (debug_per_day is null or debug_per_day >= 0);

alter table public.daily_limit_settings
add column if not exists quiz_per_day integer check (quiz_per_day is null or quiz_per_day >= 0);

insert into public.daily_limit_settings (id, games_per_day, communication_per_day, debug_per_day, quiz_per_day)
values ('global', null, null, null, null)
on conflict (id) do nothing;

create table if not exists public.daily_limit_usage (
  email text not null,
  kind text not null check (kind in ('game', 'communication', 'debug', 'quiz') or kind like 'game:%' or kind like 'communication:%' or kind like 'debug:%' or kind like 'quiz:%'),
  count integer not null default 0 check (count >= 0),
  reset_at timestamptz not null,
  updated_at timestamptz not null default now(),
  primary key (email, kind)
);

alter table public.daily_limit_usage
drop constraint if exists daily_limit_usage_kind_check;

alter table public.daily_limit_usage
add constraint daily_limit_usage_kind_check
check (kind in ('game', 'communication', 'debug', 'quiz') or kind like 'game:%' or kind like 'communication:%' or kind like 'debug:%' or kind like 'quiz:%');

create index if not exists daily_limit_usage_reset_at_idx
on public.daily_limit_usage (reset_at);

notify pgrst, 'reload schema';
