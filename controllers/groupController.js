const Group = require('../Model/GroupSchema');

// const createGroup = async (req, res) => {
//   const { name, description } = req.body;
//   const groupExists = await Group.findOne({ name });
//   if (groupExists) {
//     return res.status(400).json({ message: "Group already exists" });
//   }
//   try {
//     const group = new Group({ name, description });
//     await group.save();
//     res.status(201).json(group);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


const createGroup = async (req, res) => {
  const { name, description } = req.body;
  try {
    const groupExists = await Group.findOne({ name });
    if (groupExists) {
      return res.status(400).json({ message: "Group already exists" });
    }
    const group = new Group({ name, description });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGroup = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateGroup = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const group = await Group.findByIdAndUpdate(id, updates, { new: true });
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteGroup = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await Group.findByIdAndDelete(id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    res.status(200).json({ message: 'Group deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deleteAllGroups = async (req, res) => {
  try {
    // Delete all groups
    const result = await Group.deleteMany({});
    
    // Check how many documents were deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No groups found to delete' });
    }
    
    res.status(200).json({ message: 'All groups deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createGroup, listGroups, getGroup, updateGroup, deleteGroup,deleteAllGroups };
