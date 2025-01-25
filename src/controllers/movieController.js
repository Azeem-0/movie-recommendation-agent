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
        if (i === 0) {
            initialQuery = await getUserQuery();
            queryParams = userResponse = initialQuery;
        } else {
            const followUpQuestion = await generateFollowUpQuestion(context.join('\n'));
            if (followUpQuestion.state[1] || followUpQuestion.state[2]) {
                resolved = followUpQuestion.state[1] ? true : false;
                break;
            }
            userResponse = await getUserFollowUpAnswer(followUpQuestion.question);
            queryParams = context.join('\n') + followUpQuestion + userResponse;
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