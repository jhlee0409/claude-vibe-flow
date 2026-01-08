import fs from "fs";
import path from "path";

export interface ProjectInfo {
  name: string;
  description: string;
  isExisting: boolean;
  techStack: TechStack;
  scripts: Record<string, string>;
  directories: string[];
}

export interface TechStack {
  language: string[];
  framework: string[];
  testFramework: string | null;
  packageManager: string | null;
}

interface PackageJson {
  name?: string;
  description?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

const FRAMEWORK_DEPS: Record<string, string> = {
  "next": "Next.js",
  "react": "React",
  "vue": "Vue",
  "svelte": "Svelte",
  "express": "Express",
  "fastify": "Fastify",
  "@nestjs/core": "NestJS",
};

const TEST_FRAMEWORK_DEPS: Record<string, string> = {
  "vitest": "Vitest",
  "jest": "Jest",
  "mocha": "Mocha",
};

export function analyzeProject(projectPath: string): ProjectInfo {
  return {
    name: extractProjectName(projectPath),
    description: extractDescription(projectPath),
    isExisting: hasExistingCode(projectPath),
    techStack: detectTechStack(projectPath),
    scripts: extractScripts(projectPath),
    directories: listMainDirectories(projectPath),
  };
}

function extractProjectName(projectPath: string): string {
  const fromPackageJson = readPackageJsonField(projectPath, "name");
  if (fromPackageJson) return fromPackageJson;

  const fromPyproject = extractTomlName(path.join(projectPath, "pyproject.toml"));
  if (fromPyproject) return fromPyproject;

  const fromCargo = extractTomlName(path.join(projectPath, "Cargo.toml"));
  if (fromCargo) return fromCargo;

  const fromGoMod = extractGoModuleName(path.join(projectPath, "go.mod"));
  if (fromGoMod) return fromGoMod;

  return path.basename(projectPath);
}

function extractDescription(projectPath: string): string {
  const fromPackageJson = readPackageJsonField(projectPath, "description");
  if (fromPackageJson) return fromPackageJson;

  const fromReadme = extractReadmeFirstLine(projectPath);
  if (fromReadme) return fromReadme;

  return "[TODO: Add project description]";
}

function hasExistingCode(projectPath: string): boolean {
  const indicators = [
    "package.json", "pyproject.toml", "Cargo.toml", "go.mod",
    "Gemfile", "pom.xml", "build.gradle", "src", "lib", "app",
  ];

  return indicators.some((indicator) => 
    fs.existsSync(path.join(projectPath, indicator))
  );
}

function detectTechStack(projectPath: string): TechStack {
  const languages: string[] = [];
  const frameworks: string[] = [];
  let testFramework: string | null = null;
  let packageManager: string | null = null;

  if (fs.existsSync(path.join(projectPath, "package.json"))) {
    const hasTypeScript = fs.existsSync(path.join(projectPath, "tsconfig.json")) ||
                          fs.existsSync(path.join(projectPath, "tsconfig.base.json"));
    languages.push(hasTypeScript ? "TypeScript" : "JavaScript");
    packageManager = detectNodePackageManager(projectPath);

    const pkg = readPackageJson(projectPath);
    if (pkg) {
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      for (const [dep, displayName] of Object.entries(FRAMEWORK_DEPS)) {
        if (allDeps[dep]) frameworks.push(displayName);
      }
      
      for (const [dep, name] of Object.entries(TEST_FRAMEWORK_DEPS)) {
        if (allDeps[dep]) {
          testFramework = name;
          break;
        }
      }
    }
  }

  if (fs.existsSync(path.join(projectPath, "pyproject.toml")) ||
      fs.existsSync(path.join(projectPath, "requirements.txt"))) {
    languages.push("Python");
    packageManager = packageManager || "pip/uv";
    
    const requirements = safeReadFile(path.join(projectPath, "requirements.txt"));
    if (requirements) {
      if (requirements.includes("pytest")) testFramework = testFramework || "pytest";
      if (requirements.includes("fastapi")) frameworks.push("FastAPI");
      if (requirements.includes("django")) frameworks.push("Django");
      if (requirements.includes("flask")) frameworks.push("Flask");
    }
  }

  if (fs.existsSync(path.join(projectPath, "go.mod"))) {
    languages.push("Go");
    packageManager = packageManager || "go mod";
    testFramework = testFramework || "go test";
  }

  if (fs.existsSync(path.join(projectPath, "Cargo.toml"))) {
    languages.push("Rust");
    packageManager = packageManager || "cargo";
    testFramework = testFramework || "cargo test";
  }

  if (fs.existsSync(path.join(projectPath, "Gemfile"))) {
    languages.push("Ruby");
    packageManager = packageManager || "bundler";
  }

  if (languages.length === 0) {
    languages.push("Unknown");
  }

  return { language: languages, framework: frameworks, testFramework, packageManager };
}

function detectNodePackageManager(projectPath: string): string {
  if (fs.existsSync(path.join(projectPath, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(projectPath, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(projectPath, "bun.lockb"))) return "bun";
  return "npm";
}

function extractScripts(projectPath: string): Record<string, string> {
  const pkg = readPackageJson(projectPath);
  if (!pkg?.scripts) return {};

  const importantScripts = ["dev", "build", "test", "start", "lint", "typecheck"];
  const result: Record<string, string> = {};
  
  for (const script of importantScripts) {
    if (pkg.scripts[script]) {
      result[script] = pkg.scripts[script];
    }
  }
  
  return result;
}

function listMainDirectories(projectPath: string): string[] {
  const importantDirs = ["src", "lib", "app", "pages", "components", "api", "tests", "test", "__tests__"];
  
  try {
    return fs.readdirSync(projectPath, { withFileTypes: true })
      .filter((entry) => 
        entry.isDirectory() && 
        !entry.name.startsWith(".") && 
        entry.name !== "node_modules" &&
        importantDirs.includes(entry.name)
      )
      .map((entry) => entry.name)
      .sort();
  } catch {
    return [];
  }
}

function readPackageJson(projectPath: string): PackageJson | null {
  try {
    const content = fs.readFileSync(path.join(projectPath, "package.json"), "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function readPackageJsonField(projectPath: string, field: "name" | "description"): string | null {
  const pkg = readPackageJson(projectPath);
  return pkg?.[field] || null;
}

function extractTomlName(filePath: string): string | null {
  const content = safeReadFile(filePath);
  if (!content) return null;
  
  const match = content.match(/name\s*=\s*"([^"]+)"/);
  return match?.[1] || null;
}

function extractGoModuleName(filePath: string): string | null {
  const content = safeReadFile(filePath);
  if (!content) return null;
  
  const match = content.match(/module\s+(\S+)/);
  if (!match) return null;
  
  const parts = match[1].split("/");
  return parts[parts.length - 1];
}

function extractReadmeFirstLine(projectPath: string): string | null {
  const readmeNames = ["README.md", "readme.md", "Readme.md"];
  
  for (const name of readmeNames) {
    const content = safeReadFile(path.join(projectPath, name));
    if (content) {
      const firstContentLine = content.split("\n").find((line) => 
        line.trim() && !line.startsWith("#")
      );
      if (firstContentLine) return firstContentLine.trim().slice(0, 200);
    }
  }
  
  return null;
}

function safeReadFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}
