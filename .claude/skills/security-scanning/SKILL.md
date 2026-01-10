# security-scanning

## Tiered Invocation (Discovery → Overview → Specific → Generate)
- Discovery: Identify assets, data sensitivity, entry points, dependency stack.
- Overview: Threat model summary, likely vulns (XSS, SQLi, SSRF, authz), tool plan.
- Specific: Checklist per area (auth, input validation, storage, transport, logging).
- Generate: Scanning commands (npm audit, SAST/DAST), code snippets for fixes.

## Triggers
- User asks for security review, audit, or scanning
- Mentions: OWASP, secrets, tokens, auth, encryption, dependency risk

## Outputs
- Risk table (area, finding, severity, action)
- Commands to run scanners
- Remediation guidance with secure defaults
- Secret handling checklist

## Policies
- Never log or hardcode secrets
- UI text must be English; Korean only in comments/docs
- Prefer parameterized queries, output encoding, least privilege

## Quick Checklist
- AuthN/Z verified?
- Input/output encoding in place?
- Secrets/config externalized?
- Dependencies scanned and patched?
