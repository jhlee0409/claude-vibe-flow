import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Plugin Structure Validation', () => {
  const projectRoot = path.resolve(__dirname, '../..');
  const claudeDir = path.join(projectRoot, '.claude');

  describe('.claude Directory', () => {
    it('should have .claude directory', () => {
      expect(fs.existsSync(claudeDir)).toBe(true);
    });
  });

  describe('Agents', () => {
    it('should have agents directory with 8 agents', () => {
      const agentsDir = path.join(claudeDir, 'agents');
      expect(fs.existsSync(agentsDir)).toBe(true);

      const agents = fs.readdirSync(agentsDir).filter((f) => f.endsWith('.md'));
      expect(agents.length).toBe(8);
      expect(agents.sort()).toEqual([
        'cvf-architect.md',
        'cvf-debugger.md',
        'cvf-performance.md',
        'cvf-planner.md',
        'cvf-researcher.md',
        'cvf-reviewer.md',
        'cvf-security.md',
        'cvf-ui-ux.md',
      ]);
    });
  });

  describe('Commands', () => {
    it('should have commands directory with 5 commands', () => {
      const commandsDir = path.join(claudeDir, 'commands');
      expect(fs.existsSync(commandsDir)).toBe(true);

      const commands = fs.readdirSync(commandsDir).filter((f) => f.endsWith('.md'));
      expect(commands.length).toBe(5);
      expect(commands.sort()).toEqual(['cvf:check.md', 'cvf:plan.md', 'cvf:review.md', 'cvf:ship.md', 'cvf:workflow.md']);
    });
  });

  describe('Skills', () => {
    it('should have skills directory with 1 skill', () => {
      const skillsDir = path.join(claudeDir, 'skills');
      expect(fs.existsSync(skillsDir)).toBe(true);

      const skills = fs.readdirSync(skillsDir);
      expect(skills.length).toBe(1);
      expect(skills.sort()).toEqual(['verify-before-commit']);
    });

    it('verify-before-commit should have SKILL.md', () => {
      const skillPath = path.join(claudeDir, 'skills', 'verify-before-commit', 'SKILL.md');
      expect(fs.existsSync(skillPath)).toBe(true);
    });
  });

  describe('Hooks', () => {
    it('should have hooks.json', () => {
      const hooksPath = path.join(claudeDir, 'hooks.json');
      expect(fs.existsSync(hooksPath)).toBe(true);

      const content = fs.readFileSync(hooksPath, 'utf-8');
      const hooks = JSON.parse(content);
      expect(hooks.hooks).toBeDefined();
    });

    it('should reference correct script paths', () => {
      const hooksPath = path.join(claudeDir, 'hooks.json');
      const content = fs.readFileSync(hooksPath, 'utf-8');
      
      expect(content).toContain('.claude/scripts/');
      expect(content).not.toContain('${CLAUDE_PLUGIN_ROOT}');
    });
  });

  describe('Scripts', () => {
    it('should have scripts directory with 3 scripts', () => {
      const scriptsDir = path.join(claudeDir, 'scripts');
      expect(fs.existsSync(scriptsDir)).toBe(true);

      const scripts = fs.readdirSync(scriptsDir).filter((f) => f.endsWith('.sh'));
      expect(scripts.length).toBe(3);
      expect(scripts.sort()).toEqual([
        'detect-test-framework.sh',
        'load-context.sh',
        'run-tests.sh',
      ]);
    });
  });

  describe('Old Structure Removed', () => {
    it('should NOT have .claude-plugin directory', () => {
      const pluginDir = path.join(projectRoot, '.claude-plugin');
      expect(fs.existsSync(pluginDir)).toBe(false);
    });

    it('should NOT have root-level agents directory', () => {
      const agentsDir = path.join(projectRoot, 'agents');
      expect(fs.existsSync(agentsDir)).toBe(false);
    });

    it('should NOT have root-level commands directory', () => {
      const commandsDir = path.join(projectRoot, 'commands');
      expect(fs.existsSync(commandsDir)).toBe(false);
    });

    it('should NOT have outputStyles directory', () => {
      const outputDir = path.join(projectRoot, 'outputStyles');
      expect(fs.existsSync(outputDir)).toBe(false);
    });
  });

  describe('Package.json', () => {
    it('should have version 1.0.0', () => {
      const pkgPath = path.join(projectRoot, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      expect(pkg.version).toBe('1.0.0');
    });

    it('should have .claude in files array', () => {
      const pkgPath = path.join(projectRoot, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      expect(pkg.files).toContain('.claude');
    });

    it('should NOT have old directories in files array', () => {
      const pkgPath = path.join(projectRoot, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      expect(pkg.files).not.toContain('.claude-plugin');
      expect(pkg.files).not.toContain('agents');
      expect(pkg.files).not.toContain('commands');
      expect(pkg.files).not.toContain('hooks');
    });
  });
});
