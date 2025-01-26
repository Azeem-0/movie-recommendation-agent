import mongoose from "mongoose";


const logSchema = new mongoose.Schema({
    query: { type: String, required: true },
    resolved: { type: Boolean, required: true, default: false },
    timestamp: { type: Date, default: Date.now },
    preferences: { type: [String], default: [] },
    suggestedMovies: { type: [String], default: [] },
    context: { type: [String], default: [] },
});

const Log = mongoose.model("Log", logSchema);

export default Log;
