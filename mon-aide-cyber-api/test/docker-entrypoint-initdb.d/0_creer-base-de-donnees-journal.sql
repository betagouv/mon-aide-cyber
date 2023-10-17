create table evenements (
                            id uuid primary key not null default gen_random_uuid(),
                            date timestamp with time zone,
                            type text,
                            donnees jsonb
);
