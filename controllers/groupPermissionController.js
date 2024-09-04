const GroupPermission = require('../Model/groupPermission');
const Group = require('../Model/GroupSchema');
const modulePermission = require('../Model/modulePermission');

// const assignPermission=async(req,res)=>{
//   const permissions =req.body;
//   const groupPermission=new GroupPermission({groupId:req.params.groupId,permissions});
//   await groupPermission.save();
//   res.status(201).json(groupPermission);
// }

const assignPermissionsToGroup = async (req, res) => {
  const { groupId } = req.params;
  const { modulePermissionid } = req.body;

  // Validate that modulePermissionid is provided and is an array
  if (!modulePermissionid || !Array.isArray(modulePermissionid) || modulePermissionid.length === 0) {
    return res.status(400).json({ error: 'Permissions should be a non-empty array.' });
  }

  try {
    // Find or create a GroupPermission document and update permissions
    const updatedGroup = await GroupPermission.findOneAndUpdate(
      { groupId },
      { $set: { modulePermissionid } }, // Ensure you're updating the correct field
      { new: true, upsert: true }  // Create a new document if it does not exist
    );

    if (!updatedGroup) {
      return res.status(404).json({ message: 'GroupPermission not found or created' });
    }

    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// // List permissions for a group
// const listPermissionsForGroup = async (req, res) => {
//   const { groupId } = req.params;

//   try {
//     const groupPermissions = await GroupPermission.find({ groupId }).populate('permissions');
//     res.status(200).json(groupPermissions);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



const listPermissionsForGroup = async (req, res) => {
  const { groupId } = req.params;

  console.log(`Searching for groupId: ${groupId}`);

  try {
    // Fetch group permissions for the specified groupId
    const groupPermissions = await GroupPermission.find({ groupId })
      .populate('modulePermissionid','name') // Populate permissions field
      .populate('groupId', 'name'); // Optionally populate group details

    console.log(`Found groupPermissions:`, groupPermissions);

    if (groupPermissions.length === 0) {
      return res.status(404).json({ message: 'No permissions found for this group' });
    }

    res.status(200).json(groupPermissions);
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: err.message });
  }
};


// Remove a specific permission from a group
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
