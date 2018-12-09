const express = require('express');
const app = express();
const bodyParser = require('body-parser')
    const request = require("request")

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.post('/build',(req,res)=> {
    request.get({url: 'http://docker-visualizer-app:5051/build', qs: {file: req.body.url}}, (err, response, body) => {
        if (err) console.log(err);
        res.send('Process is done');
    })
});

app.get('/hello',(req,res)=>{
    http.get('http://docker-visualizer-app:5051/hello', (resp) => {
        let data = '';
        resp.on('end', () => {
            console.log('finished!!!');
            console.log(JSON.parse(data));
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
})

app.listen(5050,()=>{
    console.log('Server is running on port 5050...');
})