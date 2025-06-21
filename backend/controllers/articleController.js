import { anonymizePDFWithPython, decryptAnonymizedData } from "../utils/pythonService.js";
import Article from "../models/Article.js";
import fs from "fs";

export const anonymizeArticle = async (req, res) => {
  try {
    console.log(" İşlenen Tracking ID:", req.params.trackingId);
    const trackingId = req.params.trackingId;
    const article = await Article.findOne({ trackingId });

    if (!article || !article.pdf || !article.pdf.data) {
      return res.status(404).json({ message: "Makale veya PDF bulunamadı" });
    }

    const pdfBuffer = article.pdf.data;
    const encryptedData = await anonymizePDFWithPython(pdfBuffer);

    article.anonymizedPdf = {
      data: encryptedData,
      contentType: "application/pdf",
    };

    await article.save();
    res.status(200).json({ message: "Makale başarıyla anonimleştirildi" });
  } catch (error) {
    console.error(" Anonimleştirme hatası:", error);
    res.status(500).json({ message: "Anonimleştirme işlemi başarısız oldu" });
  }
};

export const getAnonymizedPDF = async (req, res) => {
  try {
    const trackingId = req.params.trackingId;
    const article = await Article.findOne({ trackingId });

    if (!article || !article.anonymizedPdf || !article.anonymizedPdf.data) {
      return res.status(404).json({ message: "Anonimleştirilmiş PDF bulunamadı" });
    }

    const encryptedPdf = article.anonymizedPdf.data;
    const pdfBuffer = await decryptAnonymizedData(encryptedPdf);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=anonymized_article.pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error(" PDF gönderme hatası:", error);
    res.status(500).json({ message: "PDF gönderme işlemi başarısız oldu" });
  }
};