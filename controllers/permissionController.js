const Permission = require('../Model/permissionSchema');
const Module = require('../Model/ModuleSchema');
const ModulePermission=require('../Model/modulePermission')

// create permission
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

///list permission
const listPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json(permissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//list permission by id
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

////update permission
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

///delete permission
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


///assign permission to module
const assignPermissionsToModule = async (req, res) => {
  const { moduleId } = req.params;
  const { permissionIds } = req.body;

  if (!permissionIds || !Array.isArray(permissionIds) || permissionIds.length === 0) {
    return res.status(400).json({ error: 'permissionIds should be a non-empty array.' });
  }

  try {
    // Check if the module permissions already exist
    let modulePermission = await ModulePermission.findOne({ moduleId });

    if (modulePermission) {
      // Update existing document
      modulePermission.permissions = Array.from(new Set([...modulePermission.permissions, ...permissionIds]));
      await modulePermission.save();
    } else {
      // Create new document
      await ModulePermission.create({ moduleId, permissions: permissionIds });
    }

    res.status(200).json({ message: 'Permissions assigned to module' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//list permission of modules by module id
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

// Remove permissions from module
const removePermissionsFromModule = async (req, res) => {
  const { moduleId } = req.params;
  const { permissionIds } = req.body;

  if (!permissionIds || !Array.isArray(permissionIds) || permissionIds.length === 0) {
    return res.status(400).json({ error: 'permissionIds should be a non-empty array.' });
  }

  try {
    // Find the module permissions
    let modulePermission = await ModulePermission.findOne({ moduleId });

    if (!modulePermission) {
      return res.status(404).json({ message: 'Module permissions not found' });
    }

    // Remove the specified permissions from the module
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
