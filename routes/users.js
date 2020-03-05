const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Middleware for getting one user
const getUser = async (req, res, next) => {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: `Cannot find user with id ${req.params.id}` })
        }
    } catch (err) {
        return res.json({ message: err.message });
    }

    res.user = user;
    next();
}

// Get All
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get One
router.get('/:id', getUser, (req, res) => {
    res.send(res.user);
});

// Create One
router.post('/', async (req, res) => {

    const user = new User({
        name: req.body.name,
        age: req.body.age
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }


});

// Update One
router.patch('/:id', getUser, async (req, res) => {

    console.log(req.body);
    if (req.body.name) res.user.name = req.body.name;
    if (req.body.age) res.user.age = req.body.age
    
    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
        console.log(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
    
});

// Delete One
router.delete('/:id', getUser, async (req, res) => {
    try {
        res.user.remove();
        res.json({ message: 'user Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;