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
  try {
    const permissions = await Permission.find();
    res.status(200).json(permissions);
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

// const assignPermissionsToModule = async (req, res) => {
//   const { moduleId } = req.params;
//   const { permissionIds } = req.body;

//   try {
//     // Ensure module exists
//     const module = await Module.findById(moduleId);
//     if (!module) return res.status(404).json({ message: 'Module not found' });

//     // Add new permissions
//     const modulePermissions = {
//       moduleId,
//       permissions: permissionIds
//     };

//     await ModulePermission.create(modulePermissions);

//     res.status(200).json({ message: 'Permissions assigned to module' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// List permissions for a module

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

/// assign User to group
const checkUserPermission = async (req, res) => {
  const { userId, requiredPermission } = req.params;

  try {
    // Find user and their groups
    const user = await User.findById(userId).populate('groups');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all permissions for the user's groups
    const groupPermissions = await GroupPermission.find({
      groupId: { $in: user.groups.map(group => group._id) }
    }).populate('permissions');

    // Flatten permissions and check if the required permission exists
    const permissions = groupPermissions.flatMap(groupPerm => groupPerm.permissions);
    const hasPermission = permissions.some(perm => perm.name === requiredPermission);

    if (hasPermission) {
      res.status(200).json({ message: 'User has the required permission' });
    } else {
      res.status(403).json({ message: 'User does not have the required permission' });
    }
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
  checkUserPermission
};
