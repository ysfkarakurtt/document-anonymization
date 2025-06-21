import express from "express";
import multer from "multer";
import Article from "../models/Article.js";
import { v4 as uuidv4 } from "uuid";
import { anonymizeArticle, getAnonymizedPDF } from "../controllers/articleController.js";


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });


const findArticleByTrackingId = async (trackingId) => {
    return await Article.findOne({ trackingId });
};

router.post("/upload", upload.single("pdf"), async (req, res) => {
    try {
        const { title, authorEmail } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const trackingId = uuidv4();

        const newArticle = new Article({
            title,
            authorEmail,
            trackingId,
            status: "waiting",
            pdf: {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            }
        });

        await newArticle.save();

        res.status(201).json({ message: "Article uploaded!", trackingId });
    } catch (error) {
        console.error("Error during file upload:", error);
        res.status(500).json({ message: "Error", error: error.message });
    }
});


router.get("/article/:trackingId", async (req, res) => {
    try {
        const article = await findArticleByTrackingId(req.params.trackingId);
        if (!article) {
            return res.status(404).json({ message: "Makale bulunamadı" });
        }
        res.json({ article });
    } catch (error) {
        console.error("Makale getirme hatası:", error);
        res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
});
router.post("/article/update", async (req, res) => {

    const { trackingId, status, editorMessage } = req.body;
    try {
        const article = await findArticleByTrackingId(trackingId);
        if (!article) {
            return res.status(404).json({ message: "Makale bulunamadı" });
        }
        if (status) article.status = status;
        if (editorMessage) article.messageToEditor = editorMessage;

        await article.save();

        res.status(201).json({ message: "Article uploaded!", trackingId, article });
    } catch (error) {
        console.error("Makale getirme hatası:", error);
        res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
});


router.get("/pdf/:trackingId", async (req, res) => {
    try {
        console.log("test: " + req.params.trackingId)
        const trackingId = req.params.trackingId
        const article = await Article.findOne({ trackingId });

        if (!article) {
            return res.status(404).json({ message: "PDF bulunamadı" });
        }

        res.contentType(article.pdf.contentType);
        res.send(Buffer.from(article.pdf.data, 'base64'));
    } catch (error) {
        console.error("PDF getirme hatası:", error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
});


router.get("/anonymized", async (req, res) => {
    try {
        const anonymizedArticles = await Article.find({ "anonymizedPdf.data": { $exists: true } });

        if (anonymizedArticles.length === 0) {
            return res.status(404).json({ message: "Henüz anonimleşmiş makale bulunmamaktadır" });
        }

        res.json(anonymizedArticles);
    } catch (error) {
        console.error("Anonimleşmiş makale getirme hatası:", error);
        res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
});


router.get("/anonymized/pdf/:trackingId", getAnonymizedPDF);


router.get("/status/:trackingId", async (req, res) => {
    try {
        const { authorEmail } = req.query;

        if (!authorEmail) {
            return res.status(400).json({ message: "Yazar e-posta adresi gerekli" });
        }

        const article = await Article.findOne({ trackingId: req.params.trackingId, authorEmail });

        if (!article) {
            return res.status(404).json({ message: "Makale bulunamadı veya erişiminiz yok" });

        }

        res.json({ status: article.status });

    } catch (error) {
        console.error("Makale durumu getirme hatası:", error);
        res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
});


router.post("/anonymize/:trackingId", anonymizeArticle);

router.get('/', async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
})

export default router;
