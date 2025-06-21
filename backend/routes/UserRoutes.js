import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const user = new User({ name, email, role });
        await user.save();
        res.status(201).json({ message: "User created successful", user })
    }
    catch (error) {
        res.status(500).json({ message: "Error", error });
    }
})

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
})


router.get('/referee', async (req, res) => {
    try {
        const users = await User.find({ role: "referee" });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
})


router.get('/referee-by-name', async (req, res) => {
    try {
      const { name } = req.query; 
      const users = await User.find({ role: "referee", name: { $regex: name, $options: 'i' } }); 
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error", error });
    }
  });

  
router.get('/referee/:reviewerId', async (req, res) => {
    try {
        const reviewerId = req.params.reviewerId;
        const users = await User.findOne({ role: "referee", _id: reviewerId });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
})

export default router;