const normalizeName = (name: string): string => name.trim().toLowerCase();

const defaultEnabledToolNames = [
  // Add tool names here to restrict the server to a subset of tools.
  // Leave the array empty to enable every tool.
  // Example:
  // "tests",
  // "list_test_entities",
  "tests",
  "list_test_entities",
  "people",
  "documents",
  "document_resources",
  "integrations",
  "integration_resources",
  "controls",
  "list_control_tests",
  "list_control_documents",
  "vulnerabilities",
  "frameworks",
  "list_framework_controls",
  "risks",
].map(normalizeName);

const parseEnabledToolsFromEnv = (value: string | undefined): string[] | null => {
  if (value === undefined) {
    return null;
  }

  const enabledToolNames = value
    .split(",")
    .map(normalizeName)
    .filter(Boolean);

  if (
    enabledToolNames.length === 0 ||
    enabledToolNames.includes("all") ||
    enabledToolNames.includes("*")
  ) {
    return [];
  }

  return enabledToolNames;
};

const envEnabledToolNames = parseEnabledToolsFromEnv(
  process.env.VANTA_MCP_ENABLED_TOOLS,
);

const enabledToolNames = envEnabledToolNames ?? defaultEnabledToolNames;

export const enabledTools = new Set<string>(enabledToolNames);

export const hasEnabledToolFilter = enabledTools.size > 0;

export const enabledToolsSource =
  envEnabledToolNames === null
    ? "default"
    : hasEnabledToolFilter
      ? "env"
      : "env-all";

export const isToolEnabled = (toolName: string): boolean => {
  if (!hasEnabledToolFilter) {
    return true;
  }
  return enabledTools.has(normalizeName(toolName));
};

export const getEnabledToolNames = (): string[] => [...enabledTools];
