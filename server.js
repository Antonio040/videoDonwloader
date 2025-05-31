const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for your frontend
app.use(cors({
    origin: 'https://wasabi.devz.moe'
}));

// Enable JSON body parsing
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
    res.send('YouTube Downloader API is running!');
});

// Video download endpoint
app.post('/download', async (req, res) => {
    const { url } = req.body;

    if (!url || !ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'Invalid video URL' });
    }

    try {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: '18' }); // MP4 360p

        res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
        res.setHeader('Content-Type', 'video/mp4');

        ytdl(url, { format }).pipe(res);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Failed to download video' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
