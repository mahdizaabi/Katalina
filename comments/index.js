const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors')
const app = express();
const axios = require('axios');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())


const commentsByPostId = {}
app.get('/posts/:id/comments', (req, res) => {
    const postId = req.params.id;
    res.send(commentsByPostId[postId] || [])
})

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    comments.push({ id: commentId, content, status: 'pending' });
    commentsByPostId[req.params.id] = comments;
    //emit event to the bus Event
    await axios.post('http://localhost:3456/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    })
    res.status(201).send(comments);
});


//acced emitted evnets
app.post('/events', async (req, res) => {
    const { type, data } = req.body;
    if (type === 'CommentModerated') {
        const { postId, id, status, content } = data;
        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => comment.id === id);
        comment.status = status;
        await axios.post('http://localhost:3456/events', {
            type: 'CommentUpdated',
            data: {
                id,
                status,
                postId,
                content
            }
        })
    }
    res.send({ status: 'event received' })
})
app.listen(5000, () => {
    console.log('commeents service is listening on port 5000')
})