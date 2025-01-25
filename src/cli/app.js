import getChromaCollection from '../config/vectorDb.js';
import connectDB from '../config/mongoDb.js';
import dotenv from "dotenv";
dotenv.config();
import { getPromptStartSearch } from '../utils/queryPrompts.js';
import { handleMovieSearch } from '../controllers/movieController.js';
import { handleError, handleMenuError } from '../middlewares/errorHandler.js';

(async () => {
    try {
        await connectDB();
        await mainMenu();
    } catch (error) {
        handleError(error, "init");
    }
})();

const mainMenu = async () => {
    try {
        console.log("\nWelcome to the Movie Recommendation Agent!\n");
        const startSearch = await getPromptStartSearch();

        if (!startSearch) {
            console.log("Goodbye!");
            process.exit(0);
        }

        const collection = await getChromaCollection();
        await handleMovieSearch(collection);
    } catch (error) {
        await handleMenuError(error);
    }
};


export { mainMenu };