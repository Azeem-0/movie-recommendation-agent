import Log from '../models/logs.js';

const saveLogsToDatabase = async (query, suggestedMovies, resolved, context) => {
    try {
        const logData = {
            query,
            suggestedMovies,
            resolved,
            context,
        };
        const newLog = new Log(logData);
        await newLog.save();
        console.log("Log saved to database.");
    } catch (error) {
        console.error("Error saving log to database:", error);
    }
};

export default saveLogsToDatabase;