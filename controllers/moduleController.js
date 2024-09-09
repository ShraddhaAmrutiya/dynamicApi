const Module = require('../Model/ModuleSchema');

// create module
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

//list module
const listModules = async (req, res) => {
  try {
    const modules = await Module.find();
    res.status(200).json(modules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//list module by id
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

//updates module
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


//delete module
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