const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors())

const posts = {};
// {postId:{postId:..., title:'...',comments:[{id:'..', content:'...'},{...}]}}


const handleEvents = (type, data) => {
    if (type === 'PostCreated') {
        const { id, title } = data
        console.log("event of type: ", type)
        posts[id] = { id, title, comments: [] }
    }
    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        console.log("event of type: ", type)
        post.comments.push({ id, content, status });
    }
    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => comment.id === id);
        comment.status = status;
        comment.content = content;
    }
}

app.get('/posts', (req, res) => {
    res.send(posts);
})
app.post('/events', (req, res) => {
    const { type, data } = req.body;
    handleEvents(type, data);
    res.send({ status: 'event_processed' })
})

app.listen(3005, async () => {
    console.log('Query service is listening on 3005');

    //get all the events on Boot up
    const res = await axios.get('http://event-bus-srv:3456/events');
    for (let event of res.data) {
        console.log('processing event:', event.type);
        handleEvents(event.type, event.data)
    }
});
