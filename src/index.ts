#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAllOperations } from "./registry.js";
import {
  enabledToolsSource,
  getEnabledToolNames,
  hasEnabledToolFilter,
} from "./config.js";

const server = new McpServer({
  name: "vanta-mcp",
  version: "1.1.0",
});

async function main() {
  try {
    // Register all tools automatically
    await registerAllOperations(server);

    if (hasEnabledToolFilter) {
      const enabledTools = getEnabledToolNames();
      const sourceLabel =
        enabledToolsSource === "env" ? "VANTA_MCP_ENABLED_TOOLS" : "default config";
      console.error(
        `⚠️ Tools enabled via ${sourceLabel}: ${enabledTools.join(", ")}`,
      );
    } else if (enabledToolsSource === "env-all") {
      console.error("⚠️ All tools enabled via VANTA_MCP_ENABLED_TOOLS");
    }

    // Connect to stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error(
      "🚀 Vanta MCP Server started successfully; OAuth token will be fetched on first tool call",
    );
  } catch (error) {
    console.error("Failed to start Vanta MCP Server:", error);
    process.exit(1);
  }
}

// Handle shutdown gracefully
process.on("SIGINT", () => {
  console.error("Shutting down Vanta MCP Server...");
  process.exit(0);
});

main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});
