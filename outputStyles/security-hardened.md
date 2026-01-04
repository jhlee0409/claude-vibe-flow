# 🛡️ Security Hardened

> Comprehensive security checks for APIs and auth systems

---

## Input Validation
- [ ] All user input validated and sanitized
- [ ] Parameterized queries (no SQL injection)
- [ ] Path traversal prevention
- [ ] File upload restrictions (type, size)

## Authentication & Authorization
- [ ] Passwords hashed with strong algorithm (bcrypt, argon2)
- [ ] Session management secure
- [ ] JWT tokens properly validated
- [ ] Role-based access control enforced
- [ ] API endpoints protected

## Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced
- [ ] PII handling compliant
- [ ] Secure cookie flags (HttpOnly, Secure, SameSite)

## OWASP Top 10
- [ ] XSS prevention (output encoding)
- [ ] CSRF protection
- [ ] Rate limiting implemented
- [ ] Security headers set (CSP, X-Frame-Options, etc.)
- [ ] Dependency vulnerabilities checked

## Secrets Management
- [ ] No secrets in code or logs
- [ ] API keys rotatable
- [ ] Least privilege principle applied

---

## Integration Points

| Agent | Behavior |
|-------|----------|
| `vibe-implementer` | Apply security patterns during implementation |
| `code-reviewer` | Extended security review |
| `architect` | Security-first design decisions |
