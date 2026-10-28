import { MCPClient } from "@mastra/mcp";

export const mcpClient = new MCPClient({
  id: "github-mcp",
  servers: {
    github: {
      url: new URL("https://api.githubcopilot.com/mcp/"),
      requestInit: {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      },
      requireToolApproval: ({ toolName }) =>
        toolName.startsWith("create_") ||
        toolName.startsWith("delete_") ||
        toolName.startsWith("merge_"),
    },
  },
});
