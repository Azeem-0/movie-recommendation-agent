import mongoose from "mongoose";

const probingQueryResponseSchema = new mongoose.Schema({
    followUpFromSystem: { type: String, required: true },
    answerFromUser: { type: String, required: true }
}, { _id: false });

const logSchema = new mongoose.Schema({
    query: { type: String, required: true },
    resolved: { type: Boolean, required: true, default: false },
    timestamp: { type: Date, default: Date.now },
    suggestedMovies: { type: [String], default: [] },
    context: { type: [String], default: [] },
    probingQueryResponse: {
        type: [probingQueryResponseSchema],
        default: []
    }
});

const Log = mongoose.model("Log", logSchema);

export default Log;
