const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const upload = require('express-fileupload')

const app = express();
const port = process.env.PORT || 3001

app.listen(port)

app.use(bodyParser.json());
app.use(cors());
app.use(upload());

app.get('/video/:id', (req, res) => {
    const path = `assets/${req.params.id}.mp4`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);

        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1;

        // let end = parts[1]
        //     ? parseInt(parts[1], 10)
        //     : start + 20000
        // if (end > fileSize)
        //     end = fileSize-1; 

        const chunksize = (end-start) + 1;
        const file = fs.createReadStream(path, {start:start, end:end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } 
    //send all video if there is no range
    // else {
    //     const head = {
    //         'Content-Length': fileSize,
    //         'Content-Type': 'video/mp4',
    //     };
    //     res.writeHead(200, head);
    //     fs.createReadStream(path).pipe(res);
    // }
});

app.get('/video/size/:id', (req, res) => {
    const path = `assets/${req.params.id}.mp4`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    res.send(String(fileSize))
})


app.post('/upload', function(req, res) {
    console.log(req.files)
    if(req.files){
        var file = req.files.file;
        var filename = req.files.name.name
        String.prototype.replaceAllTxt = function replaceAll(search, replace) { return this.split(' ').join('_'); }
        var filename = String(filename).replaceAllTxt(' ', '_')
        file.mv('./assets/'+filename, (err)=>{
            if(err)
            res.send(err)
            res.send(filename+ " Uploaded Successfully")
    })

    }else{
        res.send("Something went wrong!")
    }

});

app.get('/getVideos', function(req, res) {
    let filesList = []

    fs.readdirSync('./assets').forEach(file => {
          filesList.push(file)
      });
    res.send({data: filesList})
});

app.post('/deleteVideos', function(req, res) {
    data = req.body.data
    console.log(data)
    data.forEach(file => {
        fs.unlink('./assets/'+file, (err)=>{
            res.send(err)
        })
    });
});