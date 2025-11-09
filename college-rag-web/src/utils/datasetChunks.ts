export interface Chunk {
  id: string;
  title: string;
  body: string;
}

const generateChunkId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

export const createEmptyChunk = (): Chunk => ({
  id: generateChunkId(),
  title: "",
  body: "",
});

export const serializeChunks = (chunkList: Chunk[]) =>
  chunkList
    .map(({title, body}) => {
      const trimmedBody = body.trim();
      const trimmedTitle = title.trim();

      if (!trimmedBody && !trimmedTitle) {
        return null;
      }

      if (trimmedTitle) {
        const sectionTitle = `## ${trimmedTitle}`;
        return trimmedBody ? `${sectionTitle}\n${trimmedBody}` : sectionTitle;
      }

      return trimmedBody;
    })
    .filter((part): part is string => Boolean(part && part.trim().length > 0))
    .join("\n\n");

export const parseContentToChunks = (content: string | null | undefined): Chunk[] => {
  const normalized = (content ?? "").replace(/\r\n/g, "\n");
  if (!normalized.trim()) {
    return [createEmptyChunk()];
  }

  const chunks: Chunk[] = [];
  let currentTitle = "";
  let currentBody: string[] = [];

  const pushChunk = () => {
    const bodyText = currentBody.join("\n").trim();
    if (!currentTitle.trim() && !bodyText) {
      return;
    }
    chunks.push({
      id: generateChunkId(),
      title: currentTitle.trim(),
      body: bodyText,
    });
  };

  const lines = normalized.split("\n");
  lines.forEach((line) => {
    const headingMatch = line.match(/^##\s+(.*)$/);
    if (headingMatch) {
      pushChunk();
      currentTitle = headingMatch[1] ?? "";
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  });

  pushChunk();

  return chunks.length > 0 ? chunks : [createEmptyChunk()];
};
