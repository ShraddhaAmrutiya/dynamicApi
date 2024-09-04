const User = require('../Model/UserSchema');
const Group = require('../Model/GroupSchema');

// const addUserToGroup = async (req, res) => {
//   const { userId } = req.params;
//   const { groupId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const group = await Group.findById(groupId);
//     if (!group) return res.status(404).json({ message: 'Group not found' });

//     if (user.groups.includes(groupId)) return res.status(400).json({ message: 'User already in group' });

//     user.groups.push(groupId);
//     await user.save();

//     res.status(200).json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const addUserToGroup = async (req, res) => {
//   const { userId } = req.params; // Extract userId from params
//   const { groupId } = req.body; // Extract groupId from request body

//   try {
//     // Find user and group by ID
//     const user = await User.findById(userId);
//     const group = await Group.findById(groupId);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (!group) {
//       return res.status(404).json({ message: 'Group not found' });
//     }

//     if (!user.groups.includes(groupId)) {
//       user.groups.push(groupId);
//       await user.save();
//       return res.status(200).json({ message: 'User added to group successfully' });
//     } else {
//       return res.status(400).json({ message: 'User is already in this group' });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };
const addUserToGroup = async (req, res) => {
  const { userId } = req.params;
  const { groupIds } = req.body; // Expecting groupIds to be an array

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate that groupIds is an array
    if (!Array.isArray(groupIds) || groupIds.length === 0) {
      return res.status(400).json({ message: 'groupIds should be a non-empty array' });
    }

    // Find and validate all groups
    const groups = await Group.find({ _id: { $in: groupIds } });
    const groupIdsInDb = groups.map(group => group._id.toString());

    // Add only those groupIds which are valid and not already included
    const newGroupIds = groupIds.filter(groupId => !user.groups.includes(groupId) && groupIdsInDb.includes(groupId));

    if (newGroupIds.length > 0) {
      user.groups.push(...newGroupIds);
      await user.save();
      return res.status(200).json({ message: 'User added to groups successfully', addedGroups: newGroupIds });
    } else {
      return res.status(400).json({ message: 'User is already in the specified groups or some groups are invalid' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const removeUserFromGroup = async (req, res) => {
  const { userId, groupId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.groups.includes(groupId)) return res.status(400).json({ message: 'User not in group' });

    user.groups = user.groups.filter(group => group !== groupId);
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addUserToGroup, removeUserFromGroup };
