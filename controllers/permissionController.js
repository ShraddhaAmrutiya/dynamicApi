const Permission = require('../Model/permissionSchema');
const Module = require('../Model/ModuleSchema');
const ModulePermission=require('../Model/modulePermission')

const createPermission = async (req, res) => {
  const { name, description } = req.body;

  try {
    const permission = new Permission({ name, description });
    await permission.save();
    res.status(201).json(permission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const listPermissions = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    const permissions = await Permission.find().skip(skip).limit(limitNumber);
    const totalPermissions = await Permission.countDocuments();
    const totalPages = Math.ceil(totalPermissions / limitNumber);

    res.status(200).json({
      permissions,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      totalPermissions
   
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getPermission = async (req, res) => {
  const { id } = req.params;

  try {
    const permission = await Permission.findById(id);
    if (!permission) return res.status(404).json({ message: 'Permission not found' });
    
    res.status(200).json(permission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePermission = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const permission = await Permission.findByIdAndUpdate(id, updates, { new: true });
    if (!permission) return res.status(404).json({ message: 'Permission not found' });
    
    res.status(200).json(permission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePermission = async (req, res) => {
  const { id } = req.params;

  try {
    const permission = await Permission.findByIdAndDelete(id);
    if (!permission) return res.status(404).json({ message: 'Permission not found' });
    
    res.status(200).json({ message: 'Permission deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const assignPermissionsToModule = async (req, res) => {
  const { moduleId } = req.params;
  const { permissionIds } = req.body;

  if (!permissionIds || !Array.isArray(permissionIds) || permissionIds.length === 0) {
    return res.status(400).json({ error: 'permissionIds should be a non-empty array.' });
  }

  try {
    let modulePermission = await ModulePermission.findOne({ moduleId });

    if (modulePermission) {
      modulePermission.permissions = Array.from(new Set([...modulePermission.permissions, ...permissionIds]));
      await modulePermission.save();
    } else {
      await ModulePermission.create({ moduleId, permissions: permissionIds });
    }

    res.status(200).json({ message: 'Permissions assigned to module' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listPermissionsForModule = async (req, res) => {
  const { moduleId } = req.params;

  try {
    const modulePermissions = await ModulePermission.findOne({ moduleId })
      .populate('permissions')  // Populate the `permissions` field
      .exec();

    if (!modulePermissions) return res.status(404).json({ message: 'Permissions not found for this module' });

    res.status(200).json(modulePermissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removePermissionsFromModule = async (req, res) => {
  const { moduleId } = req.params;
  const { permissionIds } = req.body;

  if (!permissionIds || !Array.isArray(permissionIds) || permissionIds.length === 0) {
    return res.status(400).json({ error: 'permissionIds should be a non-empty array.' });
  }

  try {
    let modulePermission = await ModulePermission.findOne({ moduleId });

    if (!modulePermission) {
      return res.status(404).json({ message: 'Module permissions not found' });
    }

    modulePermission.permissions = modulePermission.permissions.filter(
      (permission) => !permissionIds.includes(permission.toString())
    );

    await modulePermission.save();

    res.status(200).json({ message: 'Permissions removed from module', updatedPermissions: modulePermission.permissions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createPermission,
  listPermissions,
  getPermission,
  updatePermission,
  deletePermission,
  assignPermissionsToModule,
  listPermissionsForModule,
  removePermissionsFromModule
  
};
