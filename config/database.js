const mysql = require('mysql2');

let sharedPool = null;
let masterPool = null;

function getPool() {
    if (!sharedPool) {
        const config = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_DATABASE || 'gestion_academica',
            waitForConnections: true,
            connectionLimit: 20,
            queueLimit: 0
        };
        
        if (process.env.DB_URL) {
            sharedPool = mysql.createPool(process.env.DB_URL + '?waitForConnections=true&connectionLimit=20&queueLimit=0').promise();
        } else {
            sharedPool = mysql.createPool(config).promise();
        }
    }
    return sharedPool;
}

function getMasterPool() {
    if (!masterPool) {
        const config = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_DATABASE || 'gestion_academica',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        };
        
        if (process.env.DB_URL) {
            masterPool = mysql.createPool(process.env.DB_URL + '?waitForConnections=true&connectionLimit=10&queueLimit=0').promise();
        } else {
            masterPool = mysql.createPool(config).promise();
        }
    }
    return masterPool;
}

module.exports = { getPool, getMasterPool };
