import inquirer from 'inquirer';
import connectDB from "../config/db.js";
import Movie from "../models/movie.js";
import logger from '../utils/logger.js';
import seedMovies from '../data/seed.js';
import embedder from "../utils/embedder.js";
import getChromaCollection from '../config/vectorDb.js';


(async () => {

    try {
        // await seedMovies();

        const mainMenu = async () => {
            try {
                console.log("\nWelcome to the Movie Recommendation Agent!\n");

                const { query } = await inquirer.prompt([{
                    type: "input",
                    name: "query",
                    message: "What kind of movie are you looking for?",
                    validate: (input) => {
                        if (input.trim() === "") {
                            return "Please enter a valid query.";
                        }
                        if (input.length > 100) {
                            return "Query is too long. Please keep it under 100 characters.";
                        }
                        return true;
                    }
                }]);

                logger.info(`User searching for: ${query}`);

                const collection = await getChromaCollection();

                const userEmbeddings = (await embedder.embedContent(query)).embedding.values;

                try {
                    const results = await collection.query({
                        nResults: 1,
                        queryEmbeddings: [userEmbeddings]
                    });

                    console.log('Results:', JSON.stringify(results));
                } catch (error) {
                    console.error("Error querying collection:", error);
                }

            } catch (error) {
                console.error("\nAn error occurred:", error.message);
                logger.error("Main menu error", { error });

                const { retry } = await inquirer.prompt([{
                    type: "confirm",
                    name: "retry",
                    message: "Would you like to try again?",
                    default: true
                }]).catch(() => ({ retry: false }));

                if (retry) {
                    await mainMenu();
                } else {
                    console.log("\nExiting due to error. Goodbye!\n");
                    process.exit(1);
                }
            }
        };
        await mainMenu();
    } catch (error) {
        console.error("An error occurred during initialization:", error.message);
        logger.error("Fatal application error", { error });
        console.error("\nA critical error occurred. The application needs to close.");
        process.exit(1);
    }
})();