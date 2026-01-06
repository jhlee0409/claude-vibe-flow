import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';

const REQUIRED_AGENT_FRONTMATTER_FIELDS = ['name', 'description'] as const;

interface AgentFile {
  filePath: string;
  fileName: string;
  content: string;
  frontmatter: Record<string, unknown>;
  body: string;
}

describe('Agent Structure Validation', () => {
  let agentFiles: AgentFile[] = [];

  beforeAll(async () => {
    const agentsDir = path.resolve(__dirname, '../../.claude/agents');
    const files = await glob('*.md', { cwd: agentsDir });

    agentFiles = files.map((file) => {
      const filePath = path.join(agentsDir, file);
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

  it('should have exactly 3 agents', () => {
    expect(agentFiles.length).toBe(3);
  });

  it('should have planner, reviewer, debugger agents', () => {
    const agentNames = agentFiles.map((a) => a.fileName).sort();
    expect(agentNames).toEqual(['debugger', 'planner', 'reviewer']);
  });

  describe('Frontmatter Validation', () => {
    it('all agents should have required frontmatter fields', () => {
      const errors: string[] = [];

      for (const agent of agentFiles) {
        for (const field of REQUIRED_AGENT_FRONTMATTER_FIELDS) {
          if (!agent.frontmatter[field]) {
            errors.push(`${agent.fileName}: missing frontmatter field '${field}'`);
          }
        }
      }

      if (errors.length > 0) {
        throw new Error(`Frontmatter validation failed:\n${errors.join('\n')}`);
      }
    });

    it('all agents should have non-empty description', () => {
      const errors: string[] = [];

      for (const agent of agentFiles) {
        const description = agent.frontmatter.description;
        if (typeof description !== 'string' || description.trim().length === 0) {
          errors.push(`${agent.fileName}: description is empty or not a string`);
        }
      }

      if (errors.length > 0) {
        throw new Error(`Description validation failed:\n${errors.join('\n')}`);
      }
    });
  });

  describe('Content Quality Checks', () => {
    it('all agents should have a title (# heading)', () => {
      const errors: string[] = [];

      for (const agent of agentFiles) {
        const hasH1Heading = agent.body.match(/^#\s+.+/m);
        if (!hasH1Heading) {
          errors.push(`${agent.fileName}: missing main title (# heading)`);
        }
      }

      if (errors.length > 0) {
        throw new Error(`Title validation failed:\n${errors.join('\n')}`);
      }
    });

    it('no agent should have empty body', () => {
      const errors: string[] = [];

      for (const agent of agentFiles) {
        if (agent.body.trim().length < 100) {
          errors.push(`${agent.fileName}: body is too short (less than 100 characters)`);
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

      for (const agent of agentFiles) {
        const frontmatterName = agent.frontmatter.name;
        if (typeof frontmatterName === 'string' && frontmatterName !== agent.fileName) {
          errors.push(
            `${agent.fileName}: filename '${agent.fileName}' does not match frontmatter name '${frontmatterName}'`
          );
        }
      }

      if (errors.length > 0) {
        throw new Error(`Filename consistency failed:\n${errors.join('\n')}`);
      }
    });
  });
});
