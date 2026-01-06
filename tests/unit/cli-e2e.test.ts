import { describe, it, expect } from 'vitest';
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

    it('should mention features in help', () => {
      const result = execSync(`npx ts-node ${cliPath} --help`, {
        encoding: 'utf-8',
        cwd: projectRoot,
      });

      expect(result).toContain('3 agents');
      expect(result).toContain('4 commands');
      expect(result).toContain('Test enforcement');
    });

    it('should display help with -h flag', () => {
      const result = execSync(`npx ts-node ${cliPath} -h`, {
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

    it('should match package.json version', () => {
      const result = execSync(`npx ts-node ${cliPath} --version`, {
        encoding: 'utf-8',
        cwd: projectRoot,
      });

      const pkgPath = path.join(projectRoot, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

      expect(extractVersion(result)).toBe(`v${pkg.version}`);
    });

    it('should be v1.0.0', () => {
      const result = execSync(`npx ts-node ${cliPath} --version`, {
        encoding: 'utf-8',
        cwd: projectRoot,
      });

      expect(extractVersion(result)).toBe('v1.0.0');
    });
  });

  describe('Install Items', () => {
    it('plugin install items should exist in project', () => {
      const installItems = ['.claude-plugin', 'agents', 'commands', 'skills', 'hooks', 'scripts', '.mcp.json'];

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

    it('old .claude directory should NOT exist', () => {
      const oldItems = ['.claude', 'outputStyles'];

      for (const item of oldItems) {
        const itemPath = path.join(projectRoot, item);
        expect(fs.existsSync(itemPath)).toBe(false);
      }
    });
  });
});
