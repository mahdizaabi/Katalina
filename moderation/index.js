const express = require('express');
const axios = require('axios')


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/events', async (req, res) => {
    const { type, data } = req.body;
    if (type === 'CommentCreated') {
        setTimeout(async () => {
            const status = data.content.includes('orange') ? 'rejected' : 'approved';
            await axios.post('http://localhost:3456/events', {
                type: 'CommentModerated',
                data: {
                    id: data.id,
                    postId: data.postId,
                    status,
                    content: data.content
                }
            })
        }, 8000)

    }
    res.send({ status: 'moderation was done, event emitted.' })
})

app.listen(4006, () => {
    console.log("moderation is listening on 4006");
})
