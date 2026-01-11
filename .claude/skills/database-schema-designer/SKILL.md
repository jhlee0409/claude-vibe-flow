# database-schema-designer

## Tiered Invocation (Discovery → Overview → Specific → Generate)
- Discovery: Identify entities, relationships, query patterns, volume, SLAs.
- Overview: Propose ERD outline, keys, indexing strategy, partitioning needs.
- Specific: Define tables/collections with columns, types, constraints, indexes.
- Generate: Emit DDL/migrations, seed data plan, migration ordering.

## Triggers
- User asks for schema design or migration plan
- Mentions: ERD, tables, foreign keys, indexes, partitioning, migrations

## Outputs
- Entity list with primary keys
- Relationships (1:N, M:N) with foreign keys
- Index/partitioning plan
- Migration steps and rollback notes

## Policies
- Preserve data integrity; avoid destructive changes without plan
- UI-facing strings in English; comments/docs may be Korean
- No type suppression; use explicit constraints

## Quick Checklist
- Keys and constraints defined?
- Indexing for main queries covered?
- Rollback and migration order clear?
- Sample seed/fixture plan ready?
