import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        trackingId: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Log", logSchema);
