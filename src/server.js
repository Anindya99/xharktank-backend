const express= require('express');
const mongoose= require('mongoose');
const { db_link} = require("./config/config");
const cors = require("cors");

const app = express();
//body parser middleware
app.use(express.json());
app.use(cors());

mongoose
    .connect(db_link,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(()=> console.log('Mongoose connected...'))
    .catch(err=> console.log(err));

const pitches= require('./routes/pitches.route');

app.use('/pitches',pitches);
 

//Invalid route's error handling
app.use('*', function(req, res){
     res.send('PAGE NOT FOUND', 404);
});

const port = process.env.PORT || 8081;
app.listen(port, ()=>console.log(`server started at post ${port}`));