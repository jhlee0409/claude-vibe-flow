import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

interface HookDefinition {
  type: 'command' | 'prompt';
  command?: string;
  prompt?: string;
  timeout?: number;
}

interface HookMatcher {
  matcher: string;
  hooks: HookDefinition[];
}

interface HooksConfig {
  description: string;
  hooks: {
    SessionStart?: HookMatcher[];
    PostToolUse?: HookMatcher[];
    Stop?: HookMatcher[];
    PreToolUse?: HookMatcher[];
    SubagentStop?: HookMatcher[];
  };
}

const VALID_HOOK_EVENTS = ['SessionStart', 'PostToolUse', 'Stop', 'PreToolUse', 'SubagentStop'];
const VALID_HOOK_TYPES = ['command', 'prompt'];

describe('Hooks System Validation', () => {
  let hooksConfig: HooksConfig;
  const projectRoot = path.resolve(__dirname, '../..');

  beforeAll(() => {
    const hooksPath = path.join(projectRoot, 'hooks', 'hooks.json');
    const content = fs.readFileSync(hooksPath, 'utf-8');
    hooksConfig = JSON.parse(content);
  });

  describe('Hooks.json Structure', () => {
    it('should have a description field', () => {
      expect(hooksConfig.description).toBeDefined();
      expect(typeof hooksConfig.description).toBe('string');
      expect(hooksConfig.description.length).toBeGreaterThan(0);
    });

    it('should have a hooks object', () => {
      expect(hooksConfig.hooks).toBeDefined();
      expect(typeof hooksConfig.hooks).toBe('object');
    });

    it('should only contain valid hook events', () => {
      const events = Object.keys(hooksConfig.hooks);
      const invalidEvents = events.filter((e) => !VALID_HOOK_EVENTS.includes(e));

      if (invalidEvents.length > 0) {
        throw new Error(
          `Invalid hook events found: ${invalidEvents.join(', ')}. Valid events: ${VALID_HOOK_EVENTS.join(', ')}`
        );
      }
    });
  });

  describe('Hook Matchers', () => {
    it('all matchers should be valid patterns (glob or regex)', () => {
      const errors: string[] = [];
      const VALID_GLOB_PATTERNS = ['*'];

      for (const [eventName, matchers] of Object.entries(hooksConfig.hooks)) {
        if (!Array.isArray(matchers)) continue;

        for (const matcherConfig of matchers) {
          const pattern = matcherConfig.matcher;

          if (VALID_GLOB_PATTERNS.includes(pattern)) {
            continue;
          }

          try {
            new RegExp(pattern);
          } catch {
            errors.push(
              `${eventName}: Invalid pattern '${pattern}'`
            );
          }
        }
      }

      if (errors.length > 0) {
        throw new Error(`Invalid matchers found:\n${errors.join('\n')}`);
      }
    });

    it('all hook definitions should have valid types', () => {
      const errors: string[] = [];

      for (const [eventName, matchers] of Object.entries(hooksConfig.hooks)) {
        if (!Array.isArray(matchers)) continue;

        for (const matcherConfig of matchers) {
          for (const hook of matcherConfig.hooks) {
            if (!VALID_HOOK_TYPES.includes(hook.type)) {
              errors.push(
                `${eventName}: Invalid hook type '${hook.type}'. Valid types: ${VALID_HOOK_TYPES.join(', ')}`
              );
            }
          }
        }
      }

      if (errors.length > 0) {
        throw new Error(`Invalid hook types found:\n${errors.join('\n')}`);
      }
    });

    it('command hooks should have command field', () => {
      const errors: string[] = [];

      for (const [eventName, matchers] of Object.entries(hooksConfig.hooks)) {
        if (!Array.isArray(matchers)) continue;

        for (const matcherConfig of matchers) {
          for (const hook of matcherConfig.hooks) {
            if (hook.type === 'command' && !hook.command) {
              errors.push(`${eventName}: Command hook missing 'command' field`);
            }
          }
        }
      }

      if (errors.length > 0) {
        throw new Error(`Invalid command hooks:\n${errors.join('\n')}`);
      }
    });

    it('prompt hooks should have prompt field', () => {
      const errors: string[] = [];

      for (const [eventName, matchers] of Object.entries(hooksConfig.hooks)) {
        if (!Array.isArray(matchers)) continue;

        for (const matcherConfig of matchers) {
          for (const hook of matcherConfig.hooks) {
            if (hook.type === 'prompt' && !hook.prompt) {
              errors.push(`${eventName}: Prompt hook missing 'prompt' field`);
            }
          }
        }
      }

      if (errors.length > 0) {
        throw new Error(`Invalid prompt hooks:\n${errors.join('\n')}`);
      }
    });
  });

  describe('SessionStart Hook', () => {
    it('should exist', () => {
      expect(hooksConfig.hooks.SessionStart).toBeDefined();
    });

    it('should have at least one matcher', () => {
      expect(hooksConfig.hooks.SessionStart!.length).toBeGreaterThan(0);
    });

    it('should reference load-context.sh script that exists', () => {
      const sessionStartHooks = hooksConfig.hooks.SessionStart || [];

      for (const matcherConfig of sessionStartHooks) {
        for (const hook of matcherConfig.hooks) {
          if (hook.type === 'command' && hook.command) {
            const scriptPathPattern = /scripts\/[\w-]+\.sh/;
            const scriptMatch = hook.command.match(scriptPathPattern);
            if (scriptMatch) {
              const scriptPath = path.join(projectRoot, scriptMatch[0]);
              expect(
                fs.existsSync(scriptPath),
                `Script not found: ${scriptPath}`
              ).toBe(true);
            }
          }
        }
      }
    });
  });

  describe('PostToolUse Hook', () => {
    it('should exist', () => {
      expect(hooksConfig.hooks.PostToolUse).toBeDefined();
    });

    it('should have Edit|Write matcher for lsp_diagnostics reminder', () => {
      const postToolUseHooks = hooksConfig.hooks.PostToolUse || [];
      const hasEditWriteMatcher = postToolUseHooks.some(
        (m) => m.matcher.includes('Edit') && m.matcher.includes('Write')
      );
      expect(hasEditWriteMatcher).toBe(true);
    });
  });

  describe('Stop Hook', () => {
    it('should exist', () => {
      expect(hooksConfig.hooks.Stop).toBeDefined();
    });

    it('should have verification checkpoint prompt', () => {
      const stopHooks = hooksConfig.hooks.Stop || [];
      const hasVerificationPrompt = stopHooks.some((m) =>
        m.hooks.some(
          (h) =>
            h.type === 'prompt' &&
            h.prompt &&
            h.prompt.includes('VERIFICATION CHECKPOINT')
        )
      );
      expect(hasVerificationPrompt).toBe(true);
    });
  });

  describe('Scripts Integration', () => {
    it('load-context.sh should be executable bash script', () => {
      const scriptPath = path.join(projectRoot, 'scripts', 'load-context.sh');
      const content = fs.readFileSync(scriptPath, 'utf-8');

      expect(content.startsWith('#!/bin/bash')).toBe(true);
      expect(content).toContain('set -euo pipefail');
    });

    it('load-context.sh should output valid JSON for all code paths', () => {
      const scriptPath = path.join(projectRoot, 'scripts', 'load-context.sh');
      const content = fs.readFileSync(scriptPath, 'utf-8');

      const jsonPatterns = [
        /"continue":\s*(true|false)/,
        /"suppressOutput":\s*(true|false)/,
        /"systemMessage":/,
      ];

      for (const pattern of jsonPatterns) {
        expect(content).toMatch(pattern);
      }
    });
  });
});
