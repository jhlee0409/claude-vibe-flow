# rag-retrieval

## Tiered Invocation (Discovery → Overview → Specific → Generate)
- Discovery: Identify corpus, freshness needs, latency/quality targets, safety constraints.
- Overview: Propose retrieval stack (chunking, embeddings, vector store), ranking, filters.
- Specific: Define chunking params, embedding model, topK, rerankers, guardrails.
- Generate: Sample pipeline steps, evaluation plan (precision/recall/MRR), monitoring hooks.

## Triggers
- User asks to build/improve RAG or search
- Mentions: embeddings, vector DB, rerank, chunking, eval

## Outputs
- Retrieval config table (chunk size/overlap, model, store, topK)
- Guardrails for PII/safety filtering
- Evaluation plan and metrics
- Example code snippets for retrieval + rerank

## Policies
- Avoid storing secrets/PII in embeddings
- UI/user strings must be English; comments/docs may be Korean
- Prefer deterministic preprocessing and logged evaluations

## Quick Checklist
- Chunking and embedding model chosen?
- Filters/guardrails defined?
- topK/rerank tuned and measured?
- Eval + monitoring hooks planned?
