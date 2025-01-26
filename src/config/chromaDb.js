import embedder from "../utils/embedder.js";
import { ChromaClient } from "chromadb";

const chroma = new ChromaClient();

const getChromaCollection = async () => {
    try {
        const collection = await chroma.getOrCreateCollection({
            name: "movie",
            embeddingFunction: embedder
        });
        return collection;
    } catch (error) {
        console.error("Error initializing vector database:", error);
        throw error;
    }
};

export default getChromaCollection;