# prompt-caching

## Tiered Invocation (Discovery → Overview → Specific → Generate)
- Discovery: Identify prompt patterns, volume, latency/cost targets.
- Overview: Propose cache strategy (memory/redis/vector), keys, TTL, invalidation.
- Specific: Define cache keys, hit/miss policy, fallback, observability.
- Generate: Sample code for cache middleware/hooks, metrics, warmup scripts.

## Triggers
- User asks to reduce latency/cost for LLM calls
- Mentions: cache, prompt reuse, embeddings, vector store, TTL

## Outputs
- Cache key schema and TTLs
- Invalidation rules and fallback path
- Metrics to track hit rate and staleness
- Example middleware/hook code

## Policies
- Avoid caching sensitive secrets/tokens
- UI text must be English; comments/docs can be Korean
- Provide opt-out/refresh paths

## Quick Checklist
- Keys/TTLs defined?
- Invalidation rules clear?
- Metrics/alerts specified?
- Fallback on miss/timeouts designed?
