const express = require('express');
const app = express();

const axios = require('axios')
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const eventsQueue = [];


app.post('/events', async (req, res) => {

    //get emitted event from svc
    const event = req.body;
    console.log('event received :', event);
    // publish the event to the svc subscriberd
    await axios.post('http://post-clusterip-srv:4000/events', event)
    //await axios.post('http://localhost:5000/events', event)
    //await axios.post('http://localhost:3005/events', event)
    //await axios.post('http://localhost:4006/events', event)

    eventsQueue.push(event);

    res.send({ status: 'OK' })
})
app.get('/events',(req,res)=>{
    res.send(eventsQueue);

})
app.listen(3456, () => {
    console.log('EVENT-BUS is listening on 3456')
})
