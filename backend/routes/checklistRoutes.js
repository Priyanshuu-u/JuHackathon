import express from "express";
import Checklist from "../models/Checklist.js";
import User from "../models/userModel.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isDoctor } from "../middlewares/RoleMiddleware.js";
import { isAdminOrDoctor } from '../middlewares/RoleMiddleware.js'

const router = express.Router();

// Create a new checklist with team involvement and full details
router.post("/", protect, isAdminOrDoctor, async (req, res) => {
  try {
    const { patientDetails, team, sections } = req.body;

    const newChecklist = new Checklist({
      patientDetails,
      team,
      sections,
      createdBy: req.user._id,
    });

    await newChecklist.save();
    res.status(201).json(newChecklist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search users for adding to the team
router.get("/users", protect, async (req, res) => {
  try {
    const { search } = req.query;
    const users = await User.find({
      name: { $regex: search, $options: "i" },
    }).select("_id name email role");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Find checklists created by the user or where the user is part of the team
    const checklists = await Checklist.find({ 
      $or: [
        { createdBy: userId }, 
        { team: userId }
      ]
    }).populate('createdBy team');
    res.status(200).json(checklists);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/:checklistId', async (req, res) => {
  try {
    const checklist = await Checklist.findById(req.params.checklistId).populate('createdBy team');
    if (!checklist) {
      return res.status(404).json({ message: 'Checklist not found' });
    }
    res.status(200).json(checklist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
