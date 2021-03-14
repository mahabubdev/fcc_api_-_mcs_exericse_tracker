const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// exercise app
app.use('/api', require('./app'));


// connect mongodb
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true, 
  useFindAndModify: true
});
mongoose.connection.once('open', () => {
  console.log(`MognoDB is connected!`);
});


// test
// console.log(new Date().toISOString());
// const dateee = new Date('2021-04-10');
// console.log(dateee);

// console.log(dateee.toDateString());

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
