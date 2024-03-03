const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/albums')
.then(()=>console.log('DB connected successFully'))
.catch((err)=>console.log(err))