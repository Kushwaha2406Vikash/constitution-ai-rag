import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";

dotenv.config();
export async function fetchContext(query) {
  // Embed query
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "text-embedding-004",
  });

  const queryVector = await embeddings.embedQuery(query);

  // Pinecone search
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

  const searchResults = await pineconeIndex.query({
    topK: 10,
    vector: queryVector,
    includeMetadata: true,
  });

 
  // Join context text
  return searchResults.matches
    .map((match) => match.metadata.text)
    .join("\n\n---\n\n");
}
