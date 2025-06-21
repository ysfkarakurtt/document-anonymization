import express from "express";
import Referee from "../models/Referee.js";
import Article from "../models/Article.js";
import User from "../models/User.js";
import { ObjectId } from 'mongodb';
import multer from 'multer';

const router = express.Router();


router.post('/create', async (req, res) => {
    try {
        const { userId, articleId, comments, decision } = req.body;


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "referee") {
            return res.status(400).json({ message: "User is not a referee" });
        }


        const referee = new Referee({
            reviewer: user._id,
        });

        await referee.save();

        res.status(201).json({ message: "Referee created successfully", referee });
    } catch (error) {
        console.error("Error creating referee:", error);
        res.status(500).json({ message: "Referee creation failed", error: error.message });
    }
});




router.post("/:articleId/review", async (req, res) => {
    try {
        const { reviewerId, comments, decision } = req.body;
        const review = new Referee({
            articleId: req.params.articleId,
            reviewer: reviewerId,
            comments,
            decision
        });

        await review.save();
        await Article.findByIdAndUpdate(req.params.articleId, { status: "under_review" });

        res.status(201).json({ message: "review added!", review });
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
});


const storage = multer.memoryStorage();  
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 },  
}).single('anonymizedPdf');  

import mongoose from "mongoose";

router.put("/:reviewerId/update", upload, async (req, res) => {
    try {
        const { articleId, comments, decision } = req.body;
        const { reviewerId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(reviewerId)) {
            return res.status(400).json({ message: "Geçersiz Hakem ID!" });
        }


        const reviewerObjectId = new mongoose.Types.ObjectId(reviewerId);


        const referee = await Referee.findOne({ reviewer: reviewerObjectId });

        if (!referee) {
            return res.status(404).json({ message: "Referee not found" });
        }

        if (articleId) referee.articleId = articleId;
        if (comments) referee.comments = comments;
        if (decision) referee.decision = decision;

        await referee.save();

        res.status(200).json({ message: "Referee updated successfully", referee });
    } catch (error) {
        console.error("Error updating referee:", error);
        res.status(500).json({ message: "Referee update failed", error: error.message });
    }
});



router.get('/referee-by-id', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Geçersiz kullanıcı ID'si" });
        }
        const reviewerId = new mongoose.Types.ObjectId(userId);

        const referees = await Referee.find({ reviewer: reviewerId }).populate('articleId');
        res.json(referees);
    } catch (error) {
        console.error("Error fetching referee:", error);
        res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
});




router.get('/referee-by-articleId', async (req, res) => {
    try {
        const { articleId } = req.query; 

        if (!articleId) {
            return res.status(400).json({ message: "articleId eksik!" });
        }

        const referees = await Referee.findOne({ articleId });

        res.json(referees);
    } catch (error) {
        console.error("Error fetching referee:", error);
        res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const users = await Referee.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
})

export default router;
