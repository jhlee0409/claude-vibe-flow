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
  hooks: {
    SessionStart?: HookMatcher[];
    PostToolUse?: HookMatcher[];
    Stop?: HookMatcher[];
  };
}

const VALID_HOOK_EVENTS = ['SessionStart', 'PostToolUse', 'Stop'];
const VALID_HOOK_TYPES = ['command', 'prompt'];

describe('Hooks System Validation (v2)', () => {
  let hooksConfig: HooksConfig;
  const projectRoot = path.resolve(__dirname, '../..');

  beforeAll(() => {
    const hooksPath = path.join(projectRoot, 'hooks', 'hooks.json');
    const content = fs.readFileSync(hooksPath, 'utf-8');
    hooksConfig = JSON.parse(content);
  });

  describe('Hooks.json Structure', () => {
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

    it('should have exactly 3 hook events (SessionStart, Stop, PostToolUse)', () => {
      const events = Object.keys(hooksConfig.hooks);
      expect(events.sort()).toEqual(['PostToolUse', 'SessionStart', 'Stop']);
    });
  });

  describe('Hook Matchers', () => {
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
  });

  describe('SessionStart Hook', () => {
    it('should exist', () => {
      expect(hooksConfig.hooks.SessionStart).toBeDefined();
    });

    it('should have at least one matcher', () => {
      expect(hooksConfig.hooks.SessionStart!.length).toBeGreaterThan(0);
    });

    it('should reference load-context.sh script', () => {
      const sessionStartHooks = hooksConfig.hooks.SessionStart || [];
      const hasLoadContext = sessionStartHooks.some((m) =>
        m.hooks.some((h) => h.type === 'command' && h.command?.includes('load-context.sh'))
      );
      expect(hasLoadContext).toBe(true);
    });
  });

  describe('Stop Hook (Test Enforcement)', () => {
    it('should exist', () => {
      expect(hooksConfig.hooks.Stop).toBeDefined();
    });

    it('should reference check-tests-ran.sh for blocking', () => {
      const stopHooks = hooksConfig.hooks.Stop || [];
      const hasTestCheck = stopHooks.some((m) =>
        m.hooks.some((h) => h.type === 'command' && h.command?.includes('check-tests-ran.sh'))
      );
      expect(hasTestCheck).toBe(true);
    });
  });

  describe('PostToolUse Hook', () => {
    it('should exist', () => {
      expect(hooksConfig.hooks.PostToolUse).toBeDefined();
    });

    it('should have Edit|Write matcher', () => {
      const postToolUseHooks = hooksConfig.hooks.PostToolUse || [];
      const hasEditWriteMatcher = postToolUseHooks.some(
        (m) => m.matcher.includes('Edit') && m.matcher.includes('Write')
      );
      expect(hasEditWriteMatcher).toBe(true);
    });
  });

  describe('Scripts Integration', () => {
    it('load-context.sh should exist and be executable bash script', () => {
      const scriptPath = path.join(projectRoot, 'scripts', 'load-context.sh');
      expect(fs.existsSync(scriptPath)).toBe(true);

      const content = fs.readFileSync(scriptPath, 'utf-8');
      expect(content.startsWith('#!/bin/bash')).toBe(true);
    });

    it('check-tests-ran.sh should exist and be executable bash script', () => {
      const scriptPath = path.join(projectRoot, 'scripts', 'check-tests-ran.sh');
      expect(fs.existsSync(scriptPath)).toBe(true);

      const content = fs.readFileSync(scriptPath, 'utf-8');
      expect(content.startsWith('#!/bin/bash')).toBe(true);
    });

    it('detect-test-framework.sh should exist', () => {
      const scriptPath = path.join(projectRoot, 'scripts', 'detect-test-framework.sh');
      expect(fs.existsSync(scriptPath)).toBe(true);
    });

    it('check-tests-ran.sh should support exit code 2 for blocking', () => {
      const scriptPath = path.join(projectRoot, 'scripts', 'check-tests-ran.sh');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      expect(content).toContain('exit 2');
    });
  });
});
