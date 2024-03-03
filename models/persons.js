const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const persons = new mongoose.Schema({
    username:{
        type:String,
      
    },
    email:{
        type:String,
        unique:true,
        required:[true, 'email address not found']
    },
    password:{
        type:String,
        
    },
    genratedOtp:{
        type:Number,
        default:-1
    },
    // posts:[{type:mongoose.Schema.Types.ObjectId, ref:'posts'}]
})

persons.plugin(plm)

module.exports = mongoose.model('persons', persons);