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

  it('should have exactly 9 agents', () => {
    expect(agentFiles.length).toBe(9);
  });

  it('should have all cvf agents', () => {
    const agentNames = agentFiles.map((a) => a.fileName).sort();
    expect(agentNames).toEqual([
      'cvf-architect',
      'cvf-debugger',
      'cvf-orchestrator',
      'cvf-performance',
      'cvf-planner',
      'cvf-researcher',
      'cvf-reviewer',
      'cvf-security',
      'cvf-ui-ux',
    ]);
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

  describe('Agent Routing Behavior', () => {
    it('all agents should have example tags in description for auto-routing', () => {
      const errors: string[] = [];

      for (const agent of agentFiles) {
        const description = agent.frontmatter.description;
        if (typeof description === 'string') {
          if (!description.includes('<example>')) {
            errors.push(`${agent.fileName}: missing <example> tag in description`);
          }
          if (!description.includes('</example>')) {
            errors.push(`${agent.fileName}: missing </example> closing tag in description`);
          }
        }
      }

      if (errors.length > 0) {
        throw new Error(`Example tag validation failed:\n${errors.join('\n')}`);
      }
    });

    it('tools field should be comma-separated string (not array)', () => {
      const errors: string[] = [];

      for (const agent of agentFiles) {
        const tools = agent.frontmatter.tools;
        if (tools !== undefined) {
          if (Array.isArray(tools)) {
            errors.push(`${agent.fileName}: tools should be comma-separated string, not array`);
          } else if (typeof tools !== 'string') {
            errors.push(`${agent.fileName}: tools should be a string`);
          }
        }
      }

      if (errors.length > 0) {
        throw new Error(`Tools format validation failed:\n${errors.join('\n')}`);
      }
    });

    it('orchestrator should have PROACTIVELY keyword for auto-invocation', () => {
      const orchestrator = agentFiles.find((a) => a.fileName === 'cvf-orchestrator');
      expect(orchestrator).toBeDefined();

      const description = orchestrator!.frontmatter.description as string;
      expect(description).toContain('PROACTIVELY');
    });

    it('each agent should have collaboration section in body', () => {
      const errors: string[] = [];

      for (const agent of agentFiles) {
        if (!agent.body.includes('Collaboration')) {
          errors.push(`${agent.fileName}: missing Collaboration section`);
        }
      }

      if (errors.length > 0) {
        throw new Error(`Collaboration section validation failed:\n${errors.join('\n')}`);
      }
    });

    it('specialist agents should have MUST BE USED trigger in description', () => {
      const specialistAgents = ['cvf-architect', 'cvf-security', 'cvf-performance', 'cvf-researcher', 'cvf-ui-ux'];
      const errors: string[] = [];

      for (const agentName of specialistAgents) {
        const agent = agentFiles.find((a) => a.fileName === agentName);
        if (agent) {
          const description = agent.frontmatter.description as string;
          if (!description.includes('MUST BE USED')) {
            errors.push(`${agentName}: missing 'MUST BE USED' trigger phrase in description`);
          }
        }
      }

      if (errors.length > 0) {
        throw new Error(`Trigger phrase validation failed:\n${errors.join('\n')}`);
      }
    });
  });
});
