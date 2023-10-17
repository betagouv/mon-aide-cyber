create table public.diagnostics
(
    id      uuid primary key not null,
    donnees jsonb
);
