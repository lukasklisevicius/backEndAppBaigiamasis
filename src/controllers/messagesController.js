const express = require('express')
const router = express.Router()
const { connectionPool: connectionPool } = require('../db')
const sms = require('../sms')

router.post('/sendMessages', (req, res) => {
    connectionPool.getConnection(function (err, connection) {
        connection.beginTransaction((error) => {
            if (error) {
                console.log('Failed to start')
                return connection.rollback(function () {
                    return res.status(500).json({ message: 'Failed to started transactino' });
                });
            }

            const getUserSql = 'SELECT * FROM users WHERE uuid = ? FOR UPDATE';
            connection.query(getUserSql, [req.body.userData], (error, results) => {
                if (error) {
                    return connection.rollback(function () {
                        return res.status(500).json({ message: 'Failed to get user' });
                    });
                }
                if (results.length === 0) {
                    throw "aaaa"
                }
                const userInfo = results[0]
                const messageCost = 1; // Assume each message costs 1 credit
                const totalCost = req.body.participants.length * messageCost;

                if (userInfo.credits < totalCost) {
                    return res.status(400).json({ message: 'Insufficient balance' });
                }

                // console.log('userInfo', userInfo)
                // console.log(totalCost)
                const newBalance = userInfo.credits - totalCost;
                const updateBalanceSql = 'UPDATE users SET credits = ? WHERE uuid = ?';
                connection.query(updateBalanceSql, [newBalance, userInfo.UUID], (error, results) => {
                    if (error) {
                        console.log(error)
                        return connection.rollback(function () {
                            return res.status(500).json({ message: 'failed to update balance' });
                        });
                    }
                    sms.buildMessage(req.body.participants, req.body.text1, req.body.text2)
                        .then(() => {
                            connection.commit(function (err) {
                                if (err) {
                                    return connection.rollback(function () {
                                        return res.status(500).json({ message: 'Failed to commit transaction' });
                                    });
                                }
                                return res.status(200).json({ message: 'OK' });
                            });
                        })
                        .catch((err) => {
                            return connection.rollback(function () {
                                return res.status(500).json({ message: 'Failed Send' });
                            });
                        })
                })
            })

        })
    })
});

module.exports = router