import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';

const REQUIRED_COMMAND_FRONTMATTER_FIELDS = ['name', 'description'] as const;

interface CommandFile {
  filePath: string;
  fileName: string;
  content: string;
  frontmatter: Record<string, unknown>;
  body: string;
}

describe('Command Structure Validation (v2)', () => {
  let commandFiles: CommandFile[] = [];

  beforeAll(async () => {
    const commandsDir = path.resolve(__dirname, '../../commands');
    const files = await glob('*.md', { cwd: commandsDir });

    commandFiles = files.map((file) => {
      const filePath = path.join(commandsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter, content: body } = matter(content);

      return {
        filePath,
        fileName: path.basename(file, '.md'),
        content,
        frontmatter,
        body,
      };
    });
  });

  it('should have exactly 4 commands (v2)', () => {
    expect(commandFiles.length).toBe(4);
  });

  it('should have plan, review, ship, check commands', () => {
    const commandNames = commandFiles.map((c) => c.fileName).sort();
    expect(commandNames).toEqual(['check', 'plan', 'review', 'ship']);
  });

  describe('Frontmatter Validation', () => {
    it('all commands should have required frontmatter fields', () => {
      const errors: string[] = [];

      for (const command of commandFiles) {
        for (const field of REQUIRED_COMMAND_FRONTMATTER_FIELDS) {
          if (!command.frontmatter[field]) {
            errors.push(`${command.fileName}: missing frontmatter field '${field}'`);
          }
        }
      }

      if (errors.length > 0) {
        throw new Error(`Frontmatter validation failed:\n${errors.join('\n')}`);
      }
    });

    it('all commands should have non-empty description', () => {
      const errors: string[] = [];

      for (const command of commandFiles) {
        const description = command.frontmatter.description;
        if (typeof description !== 'string' || description.trim().length === 0) {
          errors.push(`${command.fileName}: description is empty or not a string`);
        }
      }

      if (errors.length > 0) {
        throw new Error(`Description validation failed:\n${errors.join('\n')}`);
      }
    });
  });

  describe('Content Quality Checks', () => {
    it('all commands should have a title (# heading)', () => {
      const errors: string[] = [];

      for (const command of commandFiles) {
        const hasH1Heading = command.body.match(/^#\s+.+/m);
        if (!hasH1Heading) {
          errors.push(`${command.fileName}: missing main title (# heading)`);
        }
      }

      if (errors.length > 0) {
        throw new Error(`Title validation failed:\n${errors.join('\n')}`);
      }
    });

    it('no command should have empty body', () => {
      const errors: string[] = [];

      for (const command of commandFiles) {
        if (command.body.trim().length < 50) {
          errors.push(`${command.fileName}: body is too short (less than 50 characters)`);
        }
      }

      if (errors.length > 0) {
        throw new Error(`Content length validation failed:\n${errors.join('\n')}`);
      }
    });
  });

  describe('Filename-Name Consistency', () => {
    it('filename should match frontmatter name', () => {
      const errors: string[] = [];

      for (const command of commandFiles) {
        const frontmatterName = command.frontmatter.name;
        if (typeof frontmatterName === 'string' && frontmatterName !== command.fileName) {
          errors.push(
            `${command.fileName}: filename '${command.fileName}' does not match frontmatter name '${frontmatterName}'`
          );
        }
      }

      if (errors.length > 0) {
        throw new Error(`Filename consistency failed:\n${errors.join('\n')}`);
      }
    });
  });
});
