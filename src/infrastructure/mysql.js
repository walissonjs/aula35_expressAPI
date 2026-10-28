import mysql from 'mysql2/promise'
import { database } from '../config/env.js'

const pool = mysql.createPool({
    ...database,
    waitForConnections: true,
    connectionLimit: 10,
    decimalNumbers: true,
    connectTimeout: 10000
});

async function verificarConexao () {
    const connection = await pool.getConnection();

    try {
        await connection.query('SELECT 1');
        console.log('Conexão com o banco: OK!');
    } finally {
        connection.release();
    }
}

export { pool, verificarConexao };