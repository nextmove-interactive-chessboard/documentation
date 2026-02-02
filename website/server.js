const express = require('express');
const mariadb = require('mariadb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// DB-Verbindungspool
const pool = mariadb.createPool({
    host: "localhost",
    user: "deinuser",
    password: "deinpasswort",
    database: "deinedb"
});

// --- API ROUTE ---
app.post("/api/register", async (req, res) => {
    const { username, hash } = req.body;

    if (!username || !hash) {
        return res.status(400).json({ error: "Fehlende Felder" });
    }

    try {
        const conn = await pool.getConnection();
        await conn.query(
            "INSERT INTO users (username, fingerprint_hash) VALUES (?, ?)",
            [username, hash]
        );
        conn.release();
        res.json({ status: "OK" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Datenbankfehler" });
    }
});

app.listen(3000, () => {
    console.log("Backend läuft auf http://localhost:3000");
});
