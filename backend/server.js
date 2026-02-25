require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const upload = require('./middleware/upload');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Upload Endpoint
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'Please upload a valid image file (.jpg or .png)'
            });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        // Save metadata to database
        await pool.query(
            'INSERT INTO images (filename, url) VALUES ($1, $2)',
            [req.file.filename, imageUrl]
        );

        res.status(200).json({
            message: 'Upload successful',
            imageUrl: imageUrl
        });

    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({
            error: 'Server error during file upload'
        });
    }
});

// Get All Images Endpoint
app.get('/api/images', async (req, res) => {
    try {
        const result = await pool.query('SELECT url FROM images ORDER BY created_at DESC');
        const imageUrls = result.rows.map(row => row.url);

        res.status(200).json({ images: imageUrls });
    } catch (err) {
        console.error('Fetch Images Error:', err);
        res.status(500).json({ error: 'Server error retrieving images' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});