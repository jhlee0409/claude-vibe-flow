# api-design

## Tiered Invocation (Discovery → Overview → Specific → Generate)
- Discovery: Identify API surface, resources, operations, versioning needs.
- Overview: Propose resource model, auth model, pagination, error shape.
- Specific: Define endpoints (method + path), request/response schemas, status codes.
- Generate: Produce OpenAPI/TS types, sample requests/responses, validation guards.

## Triggers
- User asks to design or revise an API
- Mentions: OpenAPI, REST, HTTP contract, versioning, pagination

## Outputs
- Endpoint table (method, path, purpose)
- Auth & versioning approach
- Error model (codes + fields)
- Non-breaking change notes
- Optional: OpenAPI snippet / TS types

## Policies
- UI text must remain in English
- No type suppression; prefer explicit types/guards
- Backward compatibility unless user opts into breaking changes

## Quick Checklist
- Resources and identifiers defined?
- Auth and versioning chosen?
- Pagination + filtering covered?
- Error model consistent?
- Sample success + error responses ready?
