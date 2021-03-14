const router = require('express').Router();
const {User, Exercise} = require('./models');


// POST :=> /exercise/new-user
router.post('/exercise/new-user', (req, res) => {
  const { username } = req.body;
  const newUser = new User({ username });

  newUser.save()
  .then(response => {
    res.json({
      username: response.username,
      _id: response._id
    });
  })
  .catch(err => {
    res.json({ error: "User already exists." });
  })
});




// POST :=> /exercise/add
router.post('/exercise/add', async (req, res) => {
  const { userId, duration, description, date } = req.body;

  // parse date
  // console.log("before", date);
  const parseDate = date ? new Date(date).getTime() : new Date().getTime();
  // console.log("after", parseDate);

  // check user exists
  const finduser = await User.findOne({ _id: userId });
  if (finduser) {
    let newExsObj = {
      user: userId,
      duration: parseInt(duration),
      description,
      date: parseDate
    };
    let newExercise = new Exercise(newExsObj);
    await newExercise.save()
    .then(newex => {
      res.json({
        _id: userId,
        username: finduser.username,
        date: new Date(newExercise.date).toDateString(),
        duration: parseInt(newExercise.duration),
        description: newExercise.description
      });
    });
  } else {
    res.send('Unkown user');
  }
});









// GET :=> /exercise/users
router.get('/exercise/users', async (req, res) => {
  await User.find()
  .then(data => res.json(data))
  .catch(err => res.json(err));
});









// GET :=> /exercise/log?{userId}[&from][&to][&limit]
router.get('/exercise/log', async (req, res) => {
  const query = req.query;
  let filters = {};
  // manage all filters
  if (query.from != null) {
    // make from query available
    filters.date = {
      $gte: new Date(query.from).getTime()
    };
  }

  if (query.to != null) {
    // make to query available
    filters.date = {
      $lte: new Date(query.to).getTime()
    };
  }


  let user = await User.findOne({ _id: query.userId });
  if (user) {
    //user is exists
    filters.user = query.userId;

    let exArr = await Exercise.find(filters)
      .limit(parseInt(query.limit))
    
    // compose response
    let resp = {
      _id: user._id,
      username: user.username,
      count: exArr.length,
      log: []
    };

    // compose logs
    exArr.map(arr => {
      resp.log.push({
        description: arr.description,
        duration: parseInt(arr.duration),
        date: new Date(arr.date).toDateString()
      });
    });

    // response the result
    res.json(resp);
  }
  else {
    // user not found
    res.json({ error: "User not found in our database." });
  }

});





module.exports = router;