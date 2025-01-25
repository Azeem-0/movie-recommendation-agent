import Log from '../models/logs.js';

const saveLogsToDatabase = async (query, resolved, context, suggestedMovies, probingQueryResponse) => {
    try {
        const logData = {
            query,
            resolved,
            context,
            suggestedMovies,
            probingQueryResponse
        };
        const newLog = new Log(logData);
        await newLog.save();
        console.log("Log saved to database.");
    } catch (error) {
        console.error("Error saving log to database:", error);
    }
};

export default saveLogsToDatabase;