const Users = require('../users/users-model')

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted (req, res, next) {

  if (req.session.user) {
    next()
  } else {
    next({
      message: "You shall not pass!",
      status: 401,
    })
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
const checkUsernameFree = async (req, res, next) => {

  const name = req.body.username
  const users = await Users.find()
  const exists = users.find( user => user.username === name)
  if(exists){
    res.status(422).json({message: "Username taken" })
  } else {
    next()
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
const checkUsernameExists = async ( req, res, next) => {

  
  const { username } = req.body 
  const users = await Users.findBy({username})
  if (users.length == 0) {
    res.status(401).json({ message: "Invalid credentials" })
  } else {
    next()
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {

  
  const { password } = req.body
  if ( password === undefined || password.trim().length < 3) {
    res.status(422).json({message: "Password must be longer than 3 chars"})
  } else {
    next()
  }

}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  restricted, 
  checkPasswordLength, 
  checkUsernameExists, 
  checkUsernameFree
}