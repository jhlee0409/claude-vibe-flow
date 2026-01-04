# 🚀 Production Ready

> Deployment quality checks for production services

---

## Error Handling
- [ ] Graceful degradation on failures
- [ ] User-friendly error messages
- [ ] No stack traces exposed to users
- [ ] Fallback behaviors defined

## Logging & Monitoring
- [ ] Structured logging (JSON preferred)
- [ ] Appropriate log levels (debug/info/warn/error)
- [ ] No sensitive data in logs
- [ ] Health check endpoints available

## Environment Configuration
- [ ] All secrets via environment variables
- [ ] Environment-specific configs (dev/staging/prod)
- [ ] No hardcoded URLs or credentials
- [ ] Feature flags where appropriate

## Performance Basics
- [ ] Database queries optimized (no N+1)
- [ ] Caching strategy defined
- [ ] Timeouts configured for external calls
- [ ] Connection pooling enabled

## Deployment Safety
- [ ] Database migrations are reversible
- [ ] Backward compatible API changes
- [ ] Graceful shutdown handling
- [ ] Zero-downtime deployment ready

---

## Integration Points

| Agent | Behavior |
|-------|----------|
| `vibe-implementer` | Apply production patterns during implementation |
| `code-reviewer` | Include production readiness in review |
| `architect` | Consider production constraints in decisions |
