const express = require('express')
const router = express.Router()
const { connectionPool: connectionPool } = require('../db')

router.post('/user', (req, res) => {
    const { userId } = req.body;
    const credits = 5;
    const sql = 'INSERT INTO users (UUID, credits) VALUES (?, ?)';
    connectionPool.query(sql, [userId, credits], (error, results) => {
        if (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Server error' });
            return;
        }
        res.status(201).send('User created successfully');
    });
});

router.get('/user/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    const sql = 'SELECT * FROM users WHERE uuid = ?';
    connectionPool.query(sql, [uuid], (error, results) => {
        if (error) {
            console.error('Error fetching user data:', error);
            res.status(500).json({ error: 'Server error' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(results[0]);
    });
});

module.exports = router

