-- Rename enum value QWIKINK -> QIKINK (real company name has no "w").
-- Uses RENAME VALUE instead of drop/recreate so any existing rows using
-- QWIKINK keep working under the new name instead of failing the migration.
ALTER TYPE "FulfillmentProviderName" RENAME VALUE 'QWIKINK' TO 'QIKINK';
