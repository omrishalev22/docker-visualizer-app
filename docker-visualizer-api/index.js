const express = require('express');
const app = express();
const dockervis = require('docker-visualizer');

const https = require('https');
const fs = require('fs');
const path = require('path');


app.get('/build', (req, res) => {
    const file = fs.createWriteStream("docker-compose.yml");

    https.get(req.query.file, function (response) {
        const stream = response.pipe(file);
        stream.on('finish', () => {
            console.log('download ended');

            dockervis.visualize(path.resolve(__dirname,'docker-compose.yml'), './tmp').then(result => {
                console.log(result);
                res.send(result);
            })
            res.send("done");
        })
    });


})

app.get('/hello', (req, res) => {
    console.log("I am here finally!");
    res.json('asda');
})

app.listen(5051, () => {
    console.log('Server is running on port 5051...');
})