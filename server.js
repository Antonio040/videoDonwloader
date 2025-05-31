const express = require('express');
const cors = require('cors');
const ytdlp = require('yt-dlp-exec');
const bodyParser = require('body-parser');

const app = express();
app.use(cors({ origin: 'https://wasabi.devz.moe' }));
app.use(bodyParser.json());

app.post('/download', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send('Missing video URL.');
    }

    try {
        res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
        res.setHeader('Content-Type', 'video/mp4');

        const stream = ytdlp.exec(url, {
            output: '-',
            format: 'mp4',
            stdout: 'pipe'
        });

        stream.stdout.pipe(res);
    } catch (err) {
        console.error('Download failed:', err);
        res.status(500).send('Error downloading video');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
