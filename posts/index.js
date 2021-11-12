const express = require('express');
const {randomBytes} = require('crypto');
const cors = require('cors')
const axios = require('axios')


const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cors())

const posts = {}
app.get('/posts', (req,res)=>{
    res.send(posts)
})

app.post('/posts/create', async (req,res)=>{
    const id =randomBytes(4).toString('hex');
    const {title} = req.body;
    posts[id] = {id, title:title}

    await axios.post('http://event-bus-srv:3456/events', {
        type: 'PostCreated',
        data: {
            id,title
        }
    })
    res.status(201).send(posts[id])
});

app.post('/events', (req,res)=>{
    const data = req.body;
    console.log('Received event', data.type);
    res.send({status: 'event received'})
})
app.listen(4000, ()=>{
	console.log('RORORO');
    console.log('posts service is listening on port 4000')
})
