import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["author", "editor", "referee"], required: true }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
