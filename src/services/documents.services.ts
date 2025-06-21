import { api } from "@/config/api";

export const triggerDocumentProcessing = async (sessionId: string) => {
  await api.post("documents/process", { sessionId });
};
