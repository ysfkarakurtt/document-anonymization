import mongoose from "mongoose";

const RefereeSchema = new mongoose.Schema({
    articleId: { type: String, required: false },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comments: { type: String, required: false },
    decision: { type: String, enum: ["accept", "revise", "reject"], required: false }
}, { timestamps: true });

export default mongoose.model("Referee", RefereeSchema);
