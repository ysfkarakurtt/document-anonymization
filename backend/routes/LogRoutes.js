import express from "express";
import multer from "multer";
import Log from "../models/Log.js";

const router = express.Router();

const storage = multer.memoryStorage();

router.post('/create', async (req, res) => {
    try {
        const { message, trackingId } = req.body;
        const log = new Log({ message, trackingId });
        await log.save();
        res.status(201).json({ message: "Log created successful", user })
    }
    catch (error) {
        res.status(500).json({ message: "Error", error });
    }
})

router.get('/', async (req, res) => {
    try {
        const logs = await Log.find().sort({ date: -1 }); 
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
});


export default router;
