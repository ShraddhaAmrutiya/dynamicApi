const GroupPermission = require('../Model/groupPermission');
const Group = require('../Model/GroupSchema');
const modulePermission = require('../Model/ModuleSchema');



const assignPermissionsToGroup = async (req, res) => {
  const { groupId } = req.params;
  const { modulePermissionid } = req.body;

  if (!modulePermissionid || !Array.isArray(modulePermissionid) || modulePermissionid.length === 0) {
    return res.status(400).json({ error: 'Permissions should be a non-empty array.' });
  }

  try {
    const updatedGroup = await GroupPermission.findOneAndUpdate(
      { groupId },
      { $set: { modulePermissionid } }, 
      { new: true, upsert: true }  
    );

    if (!updatedGroup) {
      return res.status(404).json({ message: 'GroupPermission not found or created' });
    }

    res.status(200).json({message:"module permission assigned to group  ",updatedGroup});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const listPermissionsForGroup = async (req, res) => {
  const { groupId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  try {
    const groupPermissions = await GroupPermission.find({ groupId })
      .populate('modulePermissionid')
      .populate('groupId', 'name')
      .skip((page - 1) * limit)
      .limit(limit);

    const totalItems = await GroupPermission.countDocuments({ groupId });
    const totalPages = Math.ceil(totalItems / limit);

    if (groupPermissions.length === 0) {
      return res.status(404).json({ message: 'No permissions found for this group' });
    }

    res.status(200).json({
      data: groupPermissions,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



const removePermissionFromGroup = async (req, res) => {
  const { groupId, modulePermissionid } = req.params;

  try {
    const result = await GroupPermission.deleteOne({ groupId, modulePermissionid });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Permission not found for this group' });
    res.status(200).json({ message: 'Permission removed from group' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  assignPermissionsToGroup,
  listPermissionsForGroup,
  removePermissionFromGroup
};
