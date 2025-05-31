const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();

app.use(cors()); // allow CORS
app.use(express.json()); // parse JSON bodies

app.post('/download', async (req, res) => {
    const { url } = req.body;
    console.log('Received URL:', url);

    if (!url || !ytdl.validateURL(url)) {
        console.error('Invalid or missing URL');
        return res.status(400).json({ error: 'Invalid video URL' });
    }

    try {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: '18' });

        res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
        res.setHeader('Content-Type', 'video/mp4');

        ytdl(url, { format }).pipe(res);
    } catch (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Failed to download video' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
