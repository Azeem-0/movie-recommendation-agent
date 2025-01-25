import { mainMenu } from "../cli/app.js";
import logger from "../utils/logger.js";
import { getRetryPrompt } from "../utils/queryPrompts.js";


const handleError = (error, context = 'General') => {
    logger.error(`${context} error`, { error });
    console.error(`${context} error:`, error.message);
}

const handleMenuError = async (error) => {
    console.error("\nAn error occurred:", error.message);
    logger.error("Main menu error", { error });

    const retry = await getRetryPrompt();

    if (retry) {
        await mainMenu();
    } else {
        console.log("\nExiting due to error. Goodbye!\n");
        process.exit(1);
    }
};

export { handleError, handleMenuError };