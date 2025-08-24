import * as dotenv from "dotenv";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";


dotenv.config();

const PDF_PATH = "./data/constitution.pdf";

// Function to load and upload data into Pinecone
export async function uploadToPinecone() {
  try {
    console.log(" Loading PDF...");
    const pdfLoader = new PDFLoader(PDF_PATH);
    const rawDocs = await pdfLoader.load();

    console.log(" Splitting text...");
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

    console.log(" Initializing embeddings...");
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY, // ⚠️ should be GOOGLE_API_KEY, not GEMINI_API_KEY
      model: "embedding-001", // recommended model for embeddings
    });

    console.log("🌲 Connecting to Pinecone...");
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    console.log("⬆️ Uploading documents to Pinecone...");
    await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
      pineconeIndex,
      maxConcurrency: 5,
    });

    console.log("✅ Data upload successfully!");
  } catch (err) {
    console.error("❌ Error uploading data:", err.message);
  }
}


