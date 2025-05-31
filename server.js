const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allow CORS from your frontend domain
app.use(cors({
    origin: 'https://wasabi.devz.moe'  // your frontend domain
}));

app.use(express.json());

// 🔽 Video download endpoint
app.post('/download', async (req, res) => {
    const videoUrl = req.body.url;

    // Basic validation
    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
        return res.status(400).json({ error: 'Invalid video URL' });
    }

    try {
        const info = await ytdl.getInfo(videoUrl);
        const format = ytdl.chooseFormat(info.formats, { quality: '18' }); // MP4 (360p)

        res.setHeader('Content-Disposition', `attachment; filename="video.mp4"`);
        res.setHeader('Content-Type', 'video/mp4');

        ytdl(videoUrl, { format }).pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to download video' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
