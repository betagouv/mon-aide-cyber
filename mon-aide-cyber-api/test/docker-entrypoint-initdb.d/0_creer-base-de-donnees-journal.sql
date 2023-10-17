create database "mac-journal";
\connect "mac-journal";
create schema journal_mac;
create table journal_mac.evenements
(
    id uuid primary key not null default gen_random_uuid(),
    date timestamp with time zone,
    type text,
    donnees jsonb
);
\disconnect;

create database "mac";
\connect "mac";
create table diagnostics
(
    id      uuid not null
        primary key,
    donnees jsonb
);

alter table diagnostics
    owner to postgres;
\disconnect;
