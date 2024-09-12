const Module = require('../Model/ModuleSchema');

const createModule = async (req, res) => {
  const { name, description } = req.body;
  
  try {
    const existingModule = await Module.findOne({ name });
    if (existingModule) {
      return res.status(400).json({ error: 'Module already exists' });
    }
    const module = new Module({ name, description });
    await module.save();
    res.status(201).json(module);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const listModules = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    const modules = await Module.find().skip(skip).limit(limitNumber);
    const totalModules = await Module.countDocuments();
    const totalPages = Math.ceil(totalModules / limitNumber);

    res.status(200).json({
      modules,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      totalModules
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getModule = async (req, res) => {
  const { id } = req.params;
  
  try {
    const module = await Module.findById(id);
    if (!module) return res.status(404).json({ message: 'Module not found' });
    
    res.status(200).json(module);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateModule = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const module = await Module.findByIdAndUpdate(id, updates, { new: true });
    if (!module) return res.status(404).json({ message: 'Module not found' });
    
    res.status(200).json(module);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const deleteModule = async (req, res) => {
  const { id } = req.params;
  
  try {
    const module = await Module.findByIdAndDelete(id);
    if (!module) return res.status(404).json({ message: 'Module not found' });
    
    res.status(200).json({ message: 'Module deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createModule,
  listModules,
  getModule,
  updateModule,
  deleteModule
};