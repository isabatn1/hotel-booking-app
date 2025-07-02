const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { OAuth2Client } = require('google-auth-library')
const googleClient = new OAuth2Client('12875774872-pc2373qu2msupp6vcadc98djt6vlm436.apps.googleusercontent.com')

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL bağlantısı
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ➤ Otelleri sırala
app.get("/hotels", async (req, res) => {
  const { city } = req.query;
  let query = "SELECT * FROM hotels";
  const values = [];

  if (city) {
    values.push(city);
    query += " WHERE city ILIKE $" + values.length;
  }

  query += " ORDER BY rating DESC";

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Veritabanı hatası" });
  }
});

// ➤ Kayıt olma
app.post("/register", async (req, res) => {
  const { email, password, country, city, photo_url, username } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash, country, city, photo_url, username) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [email, hashedPassword, country, city, photo_url, username]
    );
    res.status(201).json({ message: "Kayıt başarılı", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kayıt başarısız" });
  }
});

// ➤ Giriş yapma (email / şifre)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0)
      return res.status(401).json({ error: "Kullanıcı bulunamadı" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ error: "Şifre hatalı" });

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ message: "Giriş başarılı", token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Giriş başarısız" });
  }
});

// ➤ Sunucu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.post("/google-login", async (req, res) => {
    const { idToken } = req.body;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: "12875774872-pc2373qu2msupp6vcadc98djt6vlm436.apps.googleusercontent.com"
      });
      const payload = ticket.getPayload();
      const email = payload.email;
      const username = payload.name;
  
      const token = jwt.sign(
        { email, username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.json({ token, username });
    } catch (err) {
      console.error("Google login doğrulama hatası:", err);
      res.status(401).json({ error: "Geçersiz Google oturumu" });
    }
  });
  

