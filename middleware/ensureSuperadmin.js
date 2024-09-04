const express = require('express');
const User = require('../Model/UserSchema');


const ensureSuperadmin = async (req, res, next) => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if the user has superadmin privileges
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }

};
module.exports = ensureSuperadmin;