const express = require('express');
const router = express.Router();
const { connectionPool } = require('../db');

// Middleware for validating user data
function validateUserId(req, res, next) {
    const userId = req.body.userId || req.params.uuid;
    if (!userId || typeof userId !== 'string' || userId.length !== 36) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }
    next();
}

router.post('/user', validateUserId, (req, res) => {
    const { userId } = req.body;
    const credits = 3;
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

router.get('/user/:uuid', validateUserId, (req, res) => {
    const uuid = req.params.uuid;
    const selectSql = 'SELECT * FROM users WHERE UUID = ?';
    
    connectionPool.query(selectSql, [uuid], (error, results) => {
        if (error) {
            console.error('Error fetching user data:', error);
            res.status(500).json({ error: 'Server error' });
            return;
        }
        if (results.length === 0) {
            // User not found, so create the user
            const credits = 3;
            const insertSql = 'INSERT INTO users (UUID, credits) VALUES (?, ?)';
            
            connectionPool.query(insertSql, [uuid, credits], (insertError, insertResults) => {
                if (insertError) {
                    console.error('Error creating user:', insertError);
                    res.status(500).json({ error: 'Server error' });
                    return;
                }
                res.status(201).json({ message: 'User not found, so created successfully', user: { UUID: uuid, credits } });
            });
        } else {
            res.json(results[0]);
        }
    });
});

module.exports = router;