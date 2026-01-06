import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Plugin Structure Validation', () => {
  const projectRoot = path.resolve(__dirname, '../..');

  describe('Plugin Manifest', () => {
    it('should have .claude-plugin directory', () => {
      const pluginDir = path.join(projectRoot, '.claude-plugin');
      expect(fs.existsSync(pluginDir)).toBe(true);
    });

    it('should have plugin.json manifest', () => {
      const manifestPath = path.join(projectRoot, '.claude-plugin', 'plugin.json');
      expect(fs.existsSync(manifestPath)).toBe(true);

      const content = fs.readFileSync(manifestPath, 'utf-8');
      const manifest = JSON.parse(content);
      expect(manifest.name).toBe('claude-vibe-flow');
      expect(manifest.version).toBe('1.0.0');
    });
  });

  describe('Agents Directory', () => {
    it('should have agents directory at root with 3 agents', () => {
      const agentsDir = path.join(projectRoot, 'agents');
      expect(fs.existsSync(agentsDir)).toBe(true);

      const agents = fs.readdirSync(agentsDir).filter((f) => f.endsWith('.md'));
      expect(agents.length).toBe(3);
      expect(agents.sort()).toEqual(['debugger.md', 'planner.md', 'reviewer.md']);
    });
  });

  describe('Commands Directory', () => {
    it('should have commands directory at root with 4 commands', () => {
      const commandsDir = path.join(projectRoot, 'commands');
      expect(fs.existsSync(commandsDir)).toBe(true);

      const commands = fs.readdirSync(commandsDir).filter((f) => f.endsWith('.md'));
      expect(commands.length).toBe(4);
      expect(commands.sort()).toEqual(['check.md', 'plan.md', 'review.md', 'ship.md']);
    });
  });

  describe('Skills Directory', () => {
    it('should have skills directory at root with 2 skills', () => {
      const skillsDir = path.join(projectRoot, 'skills');
      expect(fs.existsSync(skillsDir)).toBe(true);

      const skills = fs.readdirSync(skillsDir);
      expect(skills.length).toBe(2);
      expect(skills.sort()).toEqual(['test-enforcer', 'verify-before-commit']);
    });

    it('test-enforcer should have SKILL.md', () => {
      const skillPath = path.join(projectRoot, 'skills', 'test-enforcer', 'SKILL.md');
      expect(fs.existsSync(skillPath)).toBe(true);
    });

    it('verify-before-commit should have SKILL.md', () => {
      const skillPath = path.join(projectRoot, 'skills', 'verify-before-commit', 'SKILL.md');
      expect(fs.existsSync(skillPath)).toBe(true);
    });
  });

  describe('Hooks Directory', () => {
    it('should have hooks directory at root', () => {
      const hooksDir = path.join(projectRoot, 'hooks');
      expect(fs.existsSync(hooksDir)).toBe(true);
    });

    it('should have hooks.json', () => {
      const hooksPath = path.join(projectRoot, 'hooks', 'hooks.json');
      expect(fs.existsSync(hooksPath)).toBe(true);

      const content = fs.readFileSync(hooksPath, 'utf-8');
      const hooks = JSON.parse(content);
      expect(hooks.hooks).toBeDefined();
    });
  });

  describe('Scripts Directory', () => {
    it('should have scripts directory at root with 4 scripts', () => {
      const scriptsDir = path.join(projectRoot, 'scripts');
      expect(fs.existsSync(scriptsDir)).toBe(true);

      const scripts = fs.readdirSync(scriptsDir).filter((f) => f.endsWith('.sh'));
      expect(scripts.length).toBe(4);
      expect(scripts.sort()).toEqual([
        'check-tests-ran.sh',
        'detect-test-framework.sh',
        'load-context.sh',
        'run-tests.sh',
      ]);
    });
  });

  describe('Old Structure Removed', () => {
    it('should NOT have .claude directory', () => {
      const claudeDir = path.join(projectRoot, '.claude');
      expect(fs.existsSync(claudeDir)).toBe(false);
    });

    it('should NOT have outputStyles directory', () => {
      const outputDir = path.join(projectRoot, 'outputStyles');
      expect(fs.existsSync(outputDir)).toBe(false);
    });
  });

  describe('Package.json Updates', () => {
    it('should have version 1.0.0', () => {
      const pkgPath = path.join(projectRoot, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      expect(pkg.version).toBe('1.0.0');
    });

    it('should have plugin directories in files array', () => {
      const pkgPath = path.join(projectRoot, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      expect(pkg.files).toContain('.claude-plugin');
      expect(pkg.files).toContain('agents');
      expect(pkg.files).toContain('commands');
      expect(pkg.files).toContain('skills');
      expect(pkg.files).toContain('hooks');
      expect(pkg.files).toContain('scripts');
    });

    it('should NOT have old .claude in files array', () => {
      const pkgPath = path.join(projectRoot, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      expect(pkg.files).not.toContain('.claude');
    });
  });
});
