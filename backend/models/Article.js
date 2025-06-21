import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    authorEmail: { type: String, required: true },
    pdf: { data: Buffer, contentType: String },
    authors: [{ type: String }],
    institutions: [{ type: String }],
    anonymizedPdf: { data: Buffer, contentType: String },
    trackingId: { type: String },
    anonymizedPdfId: { type: String },
    reviewComment: { type: String },
    status: { type: String, required: false },
    messageToEditor: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Article", ArticleSchema);
