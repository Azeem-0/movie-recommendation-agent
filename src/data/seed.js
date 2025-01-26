import getChromaCollection from "../config/chromaDb.js";
import embedder from "../utils/embedder.js";
import movies from "./moviesData.js";

const seedMovies = async () => {
    try {
        const collection = await getChromaCollection();

        const ids = movies.map(movie => movie.title);
        // Create embeddings from movie details - this combines multiple fields for better semantic matching
        const embeddings = await Promise.all(movies.map(movie => embedder.embedContent(`${movie.title} ${movie.genre.join(", ")} ${movie.description} ${movie.year} ${movie.rating}`)));
        const documents = movies.map(movie => `${movie.title} ${movie.genre.join(", ")} ${movie.description}`);
        const metadatas = movies.map(movie => movie);

        await collection.add({
            ids,
            embeddings: embeddings.map(e => e.embedding.values),
            documents,
            metadatas
        });

        console.log("Movies seeded successfully.");
    } catch (error) {
        console.error(`Error seeding movies: ${error}`);
        process.exit(1);
    }
};

export default seedMovies;