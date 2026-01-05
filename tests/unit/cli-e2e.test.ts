import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const projectRoot = path.resolve(__dirname, '../..');
const cliPath = path.join(projectRoot, 'src', 'cli.ts');

describe('CLI E2E Tests', () => {
  describe('Help Command', () => {
    it('should display help with --help flag', () => {
      const result = execSync(`npx ts-node ${cliPath} --help`, {
        encoding: 'utf-8',
        cwd: projectRoot,
      });

      expect(result).toContain('Usage: npx claude-vibe-flow');
      expect(result).toContain('--help');
      expect(result).toContain('--version');
      expect(result).toContain('DEBUG=1');
    });

    it('should display help with -h flag', () => {
      const result = execSync(`npx ts-node ${cliPath} -h`, {
        encoding: 'utf-8',
        cwd: projectRoot,
      });

      expect(result).toContain('Usage: npx claude-vibe-flow');
    });

    it('should display help with help command', () => {
      const result = execSync(`npx ts-node ${cliPath} help`, {
        encoding: 'utf-8',
        cwd: projectRoot,
      });

      expect(result).toContain('Usage: npx claude-vibe-flow');
    });
  });

  describe('Version Command', () => {
    function extractVersion(output: string): string {
      const versionMatch = output.match(/v\d+\.\d+\.\d+/);
      return versionMatch ? versionMatch[0] : '';
    }

    it('should display version with --version flag', () => {
      const result = execSync(`npx ts-node ${cliPath} --version`, {
        encoding: 'utf-8',
        cwd: projectRoot,
      });

      expect(result).toContain('v');
      expect(extractVersion(result)).toMatch(/^v\d+\.\d+\.\d+$/);
    });

    it('should display version with -v flag', () => {
      const result = execSync(`npx ts-node ${cliPath} -v`, {
        encoding: 'utf-8',
        cwd: projectRoot,
      });

      expect(extractVersion(result)).toMatch(/^v\d+\.\d+\.\d+$/);
    });

    it('should match package.json version', () => {
      const result = execSync(`npx ts-node ${cliPath} --version`, {
        encoding: 'utf-8',
        cwd: projectRoot,
      });

      const pkgPath = path.join(projectRoot, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

      expect(extractVersion(result)).toBe(`v${pkg.version}`);
    });
  });

  describe('Install Items', () => {
    it('all install items should exist in project', () => {
      const installItems = [
        '.claude-plugin',
        '.mcp.json',
        'agents',
        'commands',
        'hooks',
        'skills',
        'outputStyles',
      ];

      const errors: string[] = [];

      for (const item of installItems) {
        const itemPath = path.join(projectRoot, item);
        if (!fs.existsSync(itemPath)) {
          errors.push(`Install item not found: ${item}`);
        }
      }

      if (errors.length > 0) {
        throw new Error(`Missing install items:\n${errors.join('\n')}`);
      }
    });
  });

});
