const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { createWriteStream } = require('fs');
const { pipeline } = require('stream');
const youtubedl = require('youtube-dl-exec');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/download', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'Missing video URL' });
    }

    res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
    res.setHeader('Content-Type', 'video/mp4');

    const download = youtubedl.raw(url, {
        output: '-', // stream to stdout
        format: 'mp4',
    });

    pipeline(download.stdout, res, (err) => {
        if (err) {
            console.error('Pipeline failed:', err);
            res.status(500).end('Download failed');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`yt-dlp server running on port ${PORT}`);
});
