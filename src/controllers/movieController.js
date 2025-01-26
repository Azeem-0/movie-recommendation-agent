import { MAX_LOOP_ITERATIONS } from "../config/constants.js";
import generateFollowUpQuestion from "../services/probingFlow.js";
import saveLogsToDatabase from "../services/savingLogs.js";
import { getUserFollowUpAnswer, getUserQuery, getUserSatisfaction } from "../utils/queryPrompts.js";
import embedder from "../utils/embedder.js";

const handleMovieSearch = async (collection) => {
    let resolved = false;
    let context = [];
    let initialQuery;
    let suggestedMovies = [];

    for (let i = 0; i <= MAX_LOOP_ITERATIONS; i++) {
        let queryParams;
        let userResponse;

        // This prompts the user with a basic question about what kind of movie they're looking for
        if (i === 0) {
            initialQuery = await getUserQuery();
            queryParams = userResponse = initialQuery;
        } else {
            const followUpQuestion = await generateFollowUpQuestion(context.join('\n'));

            // If the user's responses indicate they want to stop the conversation or have found a satisfactory movie,
            // the AI model will set appropriate state flags to end the search process
            if (followUpQuestion.state[1] || followUpQuestion.state[2]) {
                resolved = followUpQuestion.state[1] ? true : false;
                break;
            }
            userResponse = await getUserFollowUpAnswer(followUpQuestion.question);
            queryParams = followUpQuestion + userResponse + context.slice(-2).join("\n");
        }

        const userEmbeddings = await getUserEmbeddings(queryParams);
        const formattedResults = await queryMovies(collection, userEmbeddings);

        console.log("result : ", formattedResults);

        suggestedMovies.push(...(formattedResults.map(result => result.title)));

        context.push(`Query : ${userResponse} || Response : ${formattedResults.map(result => result.title)}`);

        if (await getUserSatisfaction()) {
            resolved = true;
            break;
        }
    }

    await saveLogsToDatabase(initialQuery, [...new Set(suggestedMovies)], resolved, context);
};

const queryMovies = async (collection, userEmbeddings) => {
    const results = await collection.query({
        nResults: 3,
        queryEmbeddings: [userEmbeddings]
    });

    // Formatting the response after the vector search to return an array of movie objects
    return results.ids[0].map((id, index) => ({
        title: id,
        metadata: results.metadatas[0][index],
        distance: results.distances[0][index]
    }));
};

const getUserEmbeddings = async (queryParams) => {
    const { embedding } = await embedder.embedContent(queryParams);
    return embedding.values;
};


export { queryMovies, getUserEmbeddings, handleMovieSearch };