import inquirer from "inquirer";
import { MAX_QUERY_LENGTH } from "../config/constants.js";

const getPromptStartSearch = async () => {
    const { startSearch } = await inquirer.prompt([{
        type: "confirm",
        name: "startSearch",
        message: "Do you want to search for a movie?",
        default: true
    }]);

    return startSearch;
};


async function getUserQuery() {
    const { query } = await inquirer.prompt([{
        type: "input",
        name: "query",
        message: "What kind of movie are you looking for?",
        validate: (input) => {
            if (input.trim() === "") return `Please enter a valid ${name}`;
            if (input.length > MAX_QUERY_LENGTH) return `${name} too long (max ${MAX_QUERY_LENGTH} characters).`;
            return true;
        }
    }]);
    return query;
}

async function getUserFollowUpAnswer(question) {
    const { answer } = await inquirer.prompt([{
        type: "input",
        name: "answer",
        message: question,
        validate: (input) => {
            if (input.trim() === "") return `Please enter a valid answer`;
            return true;
        }
    }]);
    return answer;
}

async function getRetryPrompt() {
    const { retry } = await inquirer.prompt([{
        type: "confirm",
        name: "retry",
        message: "Would you like to try again?",
        default: true
    }]).catch(() => ({ retry: false }));
    return retry;
}

async function getUserSatisfaction() {
    const { satisfied } = await inquirer.prompt([{
        type: "confirm",
        name: "satisfied",
        message: "Are you satisfied with these movie suggestions?",
        default: false
    }]);
    return satisfied;
}
export { getUserFollowUpAnswer, getUserQuery, getPromptStartSearch, getRetryPrompt, getUserSatisfaction };