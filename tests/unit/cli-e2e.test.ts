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

      expect(result).toContain('10 Agents');
      expect(result).toContain('5 Commands');
      expect(result).toContain('Smart Merge');
      expect(result).toContain('Core Rules');
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
    it('.claude directory should exist with all subdirectories', () => {
      const claudeDir = path.join(projectRoot, '.claude');
      expect(fs.existsSync(claudeDir)).toBe(true);

      const requiredItems = ['agents', 'commands', 'skills', 'scripts', 'hooks.json'];
      const errors: string[] = [];

      for (const item of requiredItems) {
        const itemPath = path.join(claudeDir, item);
        if (!fs.existsSync(itemPath)) {
          errors.push(`Missing in .claude/: ${item}`);
        }
      }

      if (errors.length > 0) {
        throw new Error(`Missing items:\n${errors.join('\n')}`);
      }
    });

    it('.mcp.json should exist', () => {
      const mcpPath = path.join(projectRoot, '.mcp.json');
      expect(fs.existsSync(mcpPath)).toBe(true);
    });

    it('old root-level directories should NOT exist', () => {
      const oldItems = ['agents', 'commands', 'skills', 'hooks', 'scripts', '.claude-plugin', 'outputStyles'];

      for (const item of oldItems) {
        const itemPath = path.join(projectRoot, item);
        expect(fs.existsSync(itemPath)).toBe(false);
      }
    });
  });
});
