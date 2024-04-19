const mongoose = require('mongoose')
const Schema = mongoose.Schema


// yeha pass schema bnaye hai
const ShortUrlSchema = new Schema({
    url:{
        type: String,
        require: true,
    },

    shortId: {
        type: String,
        required: true
    }
})

// model bna rhe hai mongoose ke liye
const ShortUrl = mongoose.model('shortUrldb', ShortUrlSchema)
 // yeh database me apne aap plural bn jyega shortUrldbs
module.exports = ShortUrl