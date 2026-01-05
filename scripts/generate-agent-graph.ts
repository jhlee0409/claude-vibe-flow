#!/usr/bin/env npx ts-node

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { glob } from "glob";

interface AgentInfo {
  name: string;
  description: string;
  linkedAgents: string[];
  triggers: string[];
}

async function parseAgentFile(filePath: string): Promise<AgentInfo | null> {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const { data: frontmatter, content: body } = matter(content);

    const linkedAgentsMatch = body.match(/## Linked Agents[\s\S]*?(?=\n##|$)/);
    const linkedAgents: string[] = [];

    if (linkedAgentsMatch) {
      const agentMatches = linkedAgentsMatch[0].matchAll(
        /\*\*(\w+(?:-\w+)*)\*\*/g
      );
      for (const match of agentMatches) {
        linkedAgents.push(match[1]);
      }
    }

    const triggerMatch = body.match(
      /## Automatic Trigger Conditions[\s\S]*?(?=\n##|$)/
    );
    const triggers: string[] = [];

    if (triggerMatch) {
      const triggerLines = triggerMatch[0].match(/- .+/g);
      if (triggerLines) {
        triggers.push(...triggerLines.map((t) => t.replace(/^- /, "")));
      }
    }

    return {
      name: frontmatter.name || path.basename(filePath, ".md"),
      description: frontmatter.description || "",
      linkedAgents,
      triggers,
    };
  } catch {
    return null;
  }
}

function generateMermaidGraph(agents: AgentInfo[]): string {
  const lines = ["graph TD"];

  const nodeIds = new Map<string, string>();
  agents.forEach((agent, index) => {
    const id = `A${index}`;
    nodeIds.set(agent.name, id);
    const shortDesc = agent.description.slice(0, 30);
    lines.push(`    ${id}[${agent.name}]`);
  });

  lines.push("");

  agents.forEach((agent) => {
    const sourceId = nodeIds.get(agent.name);
    if (!sourceId) return;

    agent.linkedAgents.forEach((linked) => {
      const targetId = nodeIds.get(linked);
      if (targetId) {
        lines.push(`    ${sourceId} --> ${targetId}`);
      }
    });
  });

  return lines.join("\n");
}

function generateMarkdown(agents: AgentInfo[]): string {
  const mermaidGraph = generateMermaidGraph(agents);

  const lines = [
    "# Agent Dependency Graph",
    "",
    "> Auto-generated from agent markdown files. Do not edit manually.",
    "> Run `npx ts-node scripts/generate-agent-graph.ts` to regenerate.",
    "",
    "## Visualization",
    "",
    "```mermaid",
    mermaidGraph,
    "```",
    "",
    "## Agent Details",
    "",
    "| Agent | Dependencies | Triggers |",
    "|-------|--------------|----------|",
  ];

  agents.forEach((agent) => {
    const deps = agent.linkedAgents.length
      ? agent.linkedAgents.map((a) => `\`${a}\``).join(", ")
      : "-";
    const triggers =
      agent.triggers.length > 0
        ? agent.triggers.slice(0, 2).join("; ").slice(0, 50) + "..."
        : "-";
    lines.push(`| \`${agent.name}\` | ${deps} | ${triggers} |`);
  });

  lines.push(
    "",
    "## Dependency Matrix",
    "",
    "| Agent | Depends On | Depended By |",
    "|-------|------------|-------------|"
  );

  const dependedByMap = new Map<string, string[]>();
  agents.forEach((agent) => {
    agent.linkedAgents.forEach((linked) => {
      if (!dependedByMap.has(linked)) {
        dependedByMap.set(linked, []);
      }
      dependedByMap.get(linked)!.push(agent.name);
    });
  });

  agents.forEach((agent) => {
    const dependsOn = agent.linkedAgents.length
      ? agent.linkedAgents.map((a) => `\`${a}\``).join(", ")
      : "-";
    const dependedBy = dependedByMap.has(agent.name)
      ? dependedByMap
          .get(agent.name)!
          .map((a) => `\`${a}\``)
          .join(", ")
      : "-";
    lines.push(`| \`${agent.name}\` | ${dependsOn} | ${dependedBy} |`);
  });

  return lines.join("\n");
}

async function main(): Promise<void> {
  const agentsDir = path.resolve(__dirname, "../agents");
  const files = await glob("*.md", { cwd: agentsDir });

  const agents: AgentInfo[] = [];

  for (const file of files) {
    const agent = await parseAgentFile(path.join(agentsDir, file));
    if (agent) {
      agents.push(agent);
    }
  }

  agents.sort((a, b) => a.name.localeCompare(b.name));

  const markdown = generateMarkdown(agents);

  const outputPath = path.resolve(__dirname, "../docs/agent-dependency-graph.md");
  fs.writeFileSync(outputPath, markdown);

  console.log(`Generated: ${outputPath}`);
  console.log(`Processed ${agents.length} agents`);
}

main().catch(console.error);
