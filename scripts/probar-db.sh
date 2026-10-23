#!/usr/bin/env bash
# Crea una base vacía, aplica el esquema y ejecuta las pruebas de permisos.
# Uso: PGHOST=... PGPORT=... PGUSER=postgres scripts/probar-db.sh
set -euo pipefail
cd "$(dirname "$0")/.."
DB="klip_pruebas_$$"
createdb "$DB"
trap 'dropdb --if-exists "$DB"' EXIT
psql -q -v ON_ERROR_STOP=1 -d "$DB" -f supabase/pruebas/00_simular_supabase.sql
for f in supabase/migrations/*.sql; do psql -q -v ON_ERROR_STOP=1 -d "$DB" -f "$f"; done
psql -q -t -A -v ON_ERROR_STOP=1 -d "$DB" -f supabase/pruebas/10_permisos.sql 2>&1 >/dev/null | sed 's/^psql:[^ ]* WARNING:  //'
exit "${PIPESTATUS[0]}"
