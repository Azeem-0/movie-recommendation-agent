import inquirer from 'inquirer';
import logger from '../utils/logger.js';
import embedder from "../utils/embedder.js";
import getChromaCollection from '../config/vectorDb.js';
import saveLogsToDatabase from '../utils/saveLogs.js';
import connectDB from '../config/db.js';
import dotenv from "dotenv";
import generateFollowUpQuestion from '../services/probingFlow.js';
dotenv.config();

(async () => {

    try {
        await connectDB();

        const mainMenu = async () => {
            try {
                console.log("\nWelcome to the Movie Recommendation Agent!\n");

                const { startSearch } = await inquirer.prompt([{
                    type: "confirm",
                    name: "startSearch",
                    message: "Do you want to search for a movie?",
                    default: true
                }]);

                if (!startSearch) {
                    console.log("Goodbye!");
                    process.exit(0);
                }

                const collection = await getChromaCollection();

                let resolved = false;
                let context = [];
                let initialQuery;
                let suggestedMovies = [];
                let contextQuery;

                for (let i = 0; i <= 5; i++) {
                    let queryParams;
                    if (i === 0) {
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
                        initialQuery = query;
                        queryParams = query;
                        contextQuery = query;
                    }
                    else {
                        const followUpQuestion = await generateFollowUpQuestion(context.join('\n'));

                        if (followUpQuestion.state[1] || followUpQuestion.state[2]) {
                            resolved = followUpQuestion.state[1] ? true : false;
                            break;
                        }

                        const { answer } = await inquirer.prompt([{
                            type: "input",
                            name: "answer",
                            message: followUpQuestion.question,
                            validate: (input) => input.trim() !== "" ? true : "Please provide an answer."
                        }]);

                        queryParams = context.join('\n') + followUpQuestion + answer;
                        contextQuery = answer;
                    }

                    const userEmbeddings = (await embedder.embedContent(queryParams)).embedding.values;

                    const results = await collection.query({
                        nResults: 3,
                        queryEmbeddings: [userEmbeddings]
                    });

                    const formattedResults = results.ids[0].map((id, index) => {
                        return {
                            title: id,
                            description: results.documents[0][index],
                            metadata: results.metadatas[0][index],
                            distance: results.distances[0][index]
                        };
                    });

                    suggestedMovies.push(JSON.stringify(formattedResults, null, 2));

                    console.log("Formatted Results:", JSON.stringify(formattedResults, null, 2));

                    context.push(`Query : ${contextQuery} || Response : ${formattedResults.map(result => result.title)}`);

                    const { satisfied } = await inquirer.prompt([{
                        type: "confirm",
                        name: "satisfied",
                        message: "Are you satisfied with these movie suggestions?",
                        default: false
                    }]);

                    if (satisfied) {
                        break;
                    }
                }

                await saveLogsToDatabase(initialQuery, suggestedMovies, resolved, context);
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