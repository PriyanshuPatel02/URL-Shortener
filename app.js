const express = require('express')

const shortId = require('shortid');
const createHttpError = require('http-errors');
const mongoose = require('mongoose');
// public folder should be static folder iske liye niche wali line h
const path = require('path');  // middleware hai ye
const ShortUrl = require('./models/url.model')



const app = express();
app.use(express.static(path.join(__dirname, 'public')))
// form ke form me send krenge isliye ye below 2 lines ki need h
app.use(express.json()) 
app.use(express.urlencoded({extended: false}))
// connect MONGODB
mongoose.connect("mongodb://localhost:27017", {
    dbName: 'url-shortner'
})
.then(() => console.log("mongoose connected hurray!!"))
.catch((error) => console.log("Error connecting..."))


app.set('view engine' , 'ejs')


// handle 1st route 
app.get('/',  async(req, res, next) => {
    res.render('index')
})

//--------------POST ROUTE--------------------


app.post('/', async( req, res, next) => {
// server se respond paane ke liye ye krte h jaise create url pe click kiye toh kuch ho
    try{
       const {url} = req.body
       if( !url){ // if no url
         throw createHttpError.BadRequest("Provide a valid URL!")
       }
 // agr koi url already available h db me kisi link ka 
 // same wahi link ko return kara do
      const urlExists = await ShortUrl.findOne({url})

      if(urlExists){
        res.render('index', {short_url : `http://localhost:3000/${urlExists.shortId}`})  // render the "index" page 
      return 
 }

 // if URL doesnt exist then we have to create
 // new short url 
 const smallUrl = new ShortUrl({url: url, shortId: shortId.generate()})
            // ek url client ke pass se aa rhi h  // shortId to package h uska naaam hai
const result = await smallUrl.save();
// Assuming `res.render` renders a view
res.render('index', {
    short_url: `http://localhost:3000/${result.shortId}`

})

    }
    catch(error){
        next(error)
    }

})

// handle the get request for clicking that short URL we want that page kaise google ka
app.get('/:shortId', async(req, res, next) => {

    try {
    const {shortId} = req.params;
    const result = await ShortUrl.findOne({shortId })

    if(!result){ // agr result not found
        throw createHttpError.NotFound("Short URL doesnt exist!")
     }
     res.redirect(result.url)
    }
    
    catch (error){
        next(error)
    }

})




//***********/ Error Handler here ****** // request for 404 error
app.use((req, res, next) => {
    next(createHttpError.NotFound())
});

app.use((err, req, res, next)=> {
    res.status(err.status || 500) // 500 internal server error h.. yeh tb aayega jb aapka ((createHttpError)) this pacakge not thrown any error bole tb km ayega
    res.render('index' , {error : err.message })

})

app.listen(3000, () => console.log("Bhai 🏳️‍🌈running on port 3000..."));