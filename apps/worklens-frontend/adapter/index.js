const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config();

const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5175';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'worklens',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function init() {
  // Ensure table exists
  const createSql = `
    CREATE TABLE IF NOT EXISTS record_statuses (
      recordStatusId INT AUTO_INCREMENT PRIMARY KEY,
      recordName VARCHAR(100) NOT NULL,
      statusName VARCHAR(100) NOT NULL,
      isAllowed TINYINT(1) DEFAULT 1,
      isDefault TINYINT(1) DEFAULT 0,
      colourCode VARCHAR(20)
    );
  `;
  await pool.query(createSql);
}

const app = express();
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN }));

app.get('/records', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT recordName FROM record_statuses');
    const records = rows.map(r => r.recordName);
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

app.get('/records/:name', async (req, res) => {
  const name = req.params.name;
  try {
    const [rows] = await pool.query('SELECT * FROM record_statuses WHERE recordName = ? ORDER BY recordStatusId', [name]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch record statuses' });
  }
});

app.get('/records/:name/allowed', async (req, res) => {
  const name = req.params.name;
  try {
    const [rows] = await pool.query('SELECT * FROM record_statuses WHERE recordName = ? AND isAllowed = 1 ORDER BY recordStatusId', [name]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch allowed statuses' });
  }
});

app.put('/records/:name', async (req, res) => {
  const name = req.params.name;
  const statuses = req.body; // expect array of {recordStatusId, isAllowed, isDefault}
  if (!Array.isArray(statuses)) return res.status(400).json({ error: 'Expected array body' });
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // Update each status row
    for (const s of statuses) {
      const id = s.recordStatusId;
      const isAllowed = s.isAllowed ? 1 : 0;
      const isDefault = s.isDefault ? 1 : 0;
      await conn.query('UPDATE record_statuses SET isAllowed = ?, isDefault = ? WHERE recordStatusId = ? AND recordName = ?', [isAllowed, isDefault, id, name]);
    }
    await conn.commit();
    const [rows] = await pool.query('SELECT * FROM record_statuses WHERE recordName = ? ORDER BY recordStatusId', [name]);
    res.json(rows);
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Failed to update statuses' });
  } finally {
    conn.release();
  }
});

app.listen(PORT, async () => {
  try {
    await init();
    console.log(`Adapter listening on http://localhost:${PORT}`);
  } catch (err) {
    console.error('Failed to initialize adapter:', err);
    process.exit(1);
  }
});
