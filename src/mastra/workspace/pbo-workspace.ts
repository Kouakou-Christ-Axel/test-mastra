import { LocalFilesystem, Workspace } from "@mastra/core/workspace";

export const pboWorkspace = new Workspace({
  filesystem: new LocalFilesystem({
    basePath: "./pbo-workspace",
  }),
});
