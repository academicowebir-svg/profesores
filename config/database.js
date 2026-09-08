const mysql = require('mysql2');

let sharedPool = null;
let masterPool = null;

function getPool() {
    if (!sharedPool) {
        const useSSL = process.env.DB_SSL === 'true';
        
        if (process.env.DB_URL) {
            const urlConfig = {
                uri: process.env.DB_URL,
                waitForConnections: true,
                connectionLimit: 20,
                queueLimit: 0,
                ssl: useSSL ? { rejectUnauthorized: true } : undefined
            };
            sharedPool = mysql.createPool(urlConfig).promise();
        } else {
            const config = {
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_DATABASE || 'gestion_academica',
                waitForConnections: true,
                connectionLimit: 20,
                queueLimit: 0,
                ssl: useSSL ? { rejectUnauthorized: true } : undefined
            };
            sharedPool = mysql.createPool(config).promise();
        }
    }
    return sharedPool;
}

function getMasterPool() {
    if (!masterPool) {
        const useSSL = process.env.DB_SSL === 'true';
        
        if (process.env.DB_URL) {
            const urlConfig = {
                uri: process.env.DB_URL,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
                ssl: useSSL ? { rejectUnauthorized: true } : undefined
            };
            masterPool = mysql.createPool(urlConfig).promise();
        } else {
            const config = {
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_DATABASE || 'gestion_academica',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
                ssl: useSSL ? { rejectUnauthorized: true } : undefined
            };
            masterPool = mysql.createPool(config).promise();
        }
    }
    return masterPool;
}

module.exports = { getPool, getMasterPool };
