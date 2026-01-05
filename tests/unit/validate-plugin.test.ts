import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface PluginManifest {
  name: string;
  version: string;
  description: string;
  agents: string[];
  commands: string[];
  skills: string[];
  outputStyles: string;
}

describe('Plugin Manifest Validation', () => {
  let plugin: PluginManifest;
  const projectRoot = path.resolve(__dirname, '../..');

  beforeAll(() => {
    const pluginPath = path.join(projectRoot, '.claude-plugin', 'plugin.json');
    const content = fs.readFileSync(pluginPath, 'utf-8');
    plugin = JSON.parse(content);
  });

  describe('Manifest Structure', () => {
    it('should have required top-level fields', () => {
      expect(plugin.name).toBeDefined();
      expect(plugin.version).toBeDefined();
      expect(plugin.description).toBeDefined();
      expect(plugin.agents).toBeDefined();
      expect(plugin.commands).toBeDefined();
    });

    it('should have valid version format', () => {
      const semverRegex = /^\d+\.\d+\.\d+$/;
      expect(plugin.version).toMatch(semverRegex);
    });
  });

  describe('Agent Path Validation', () => {
    it('all agent paths should exist', () => {
      const errors: string[] = [];

      for (const agentPath of plugin.agents) {
        const fullPath = path.join(projectRoot, agentPath);
        if (!fs.existsSync(fullPath)) {
          errors.push(`Agent file not found: ${agentPath}`);
        }
      }

      if (errors.length > 0) {
        throw new Error(`Agent path validation failed:\n${errors.join('\n')}`);
      }
    });

    it('agent frontmatter name should match filename', () => {
      const errors: string[] = [];

      for (const agentPath of plugin.agents) {
        const fullPath = path.join(projectRoot, agentPath);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const { data: frontmatter } = matter(content);
          const fileName = path.basename(agentPath, '.md');

          if (frontmatter.name && frontmatter.name !== fileName) {
            errors.push(
              `Agent ${agentPath}: frontmatter name '${frontmatter.name}' doesn't match filename '${fileName}'`
            );
          }
        }
      }

      if (errors.length > 0) {
        throw new Error(`Agent name consistency failed:\n${errors.join('\n')}`);
      }
    });
  });

  describe('Command Path Validation', () => {
    it('all command paths should exist', () => {
      const errors: string[] = [];

      for (const commandPath of plugin.commands) {
        const fullPath = path.join(projectRoot, commandPath);
        if (!fs.existsSync(fullPath)) {
          errors.push(`Command file not found: ${commandPath}`);
        }
      }

      if (errors.length > 0) {
        throw new Error(`Command path validation failed:\n${errors.join('\n')}`);
      }
    });

    it('command frontmatter name should match filename', () => {
      const errors: string[] = [];

      for (const commandPath of plugin.commands) {
        const fullPath = path.join(projectRoot, commandPath);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const { data: frontmatter } = matter(content);
          const fileName = path.basename(commandPath, '.md');

          if (frontmatter.name && frontmatter.name !== fileName) {
            errors.push(
              `Command ${commandPath}: frontmatter name '${frontmatter.name}' doesn't match filename '${fileName}'`
            );
          }
        }
      }

      if (errors.length > 0) {
        throw new Error(`Command name consistency failed:\n${errors.join('\n')}`);
      }
    });
  });

  describe('Skills Path Validation', () => {
    it('all skill paths should exist', () => {
      if (!plugin.skills) return;

      const errors: string[] = [];

      for (const skillPath of plugin.skills) {
        const fullPath = path.join(projectRoot, skillPath);
        if (!fs.existsSync(fullPath)) {
          errors.push(`Skill file not found: ${skillPath}`);
        }
      }

      if (errors.length > 0) {
        throw new Error(`Skill path validation failed:\n${errors.join('\n')}`);
      }
    });
  });

  describe('Output Styles Path Validation', () => {
    it('outputStyles directory should exist', () => {
      if (!plugin.outputStyles) return;

      const fullPath = path.join(projectRoot, plugin.outputStyles);
      expect(fs.existsSync(fullPath)).toBe(true);
    });

    it('outputStyles directory should contain style files', () => {
      if (!plugin.outputStyles) return;

      const fullPath = path.join(projectRoot, plugin.outputStyles);
      if (fs.existsSync(fullPath)) {
        const files = fs.readdirSync(fullPath).filter((f) => f.endsWith('.md'));
        expect(files.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Count Verification', () => {
    it('should have 19 agents registered', () => {
      expect(plugin.agents.length).toBe(19);
    });

    it('should have 13 commands registered', () => {
      expect(plugin.commands.length).toBe(13);
    });
  });

  describe('No Duplicate Entries', () => {
    it('should have no duplicate agent paths', () => {
      const uniqueAgents = new Set(plugin.agents);
      expect(uniqueAgents.size).toBe(plugin.agents.length);
    });

    it('should have no duplicate command paths', () => {
      const uniqueCommands = new Set(plugin.commands);
      expect(uniqueCommands.size).toBe(plugin.commands.length);
    });
  });
});
