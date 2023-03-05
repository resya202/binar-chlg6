let users = require("../../data/users.json")

exports.Auth = (req, res, next) => {
  if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
    let body = req.body
    let username = body.username
    let password = body.password
    let user = users.find(u => u.username === username && u.password === password)
    if (user) {
      res.cookie('session', username, {
        maxAge: 60 * 60 * 1000 * 2,
        httpOnly: true
      })
      req.user = user
      next()
    } else {
      res.status(401).send({
        message: "Login failed, incorrect username or password"
      })
      return;
    }
  } else if (req.headers['content-type'] === 'application/json') {
    let body = JSON.parse(req.body)
    let username = body.username
    let password = body.password
    let user = users.find(u => u.username === username && u.password === password)
    if (user) {
      res.cookie('session', username, {
        maxAge: 60 * 60 * 1000 * 2,
        httpOnly: true
      })
      req.user = user
      next()
    } else {
      res.send({
        message: "Login failed, incorrect username or password"
      })
      return;
    }
  }
}

exports.checkSession = (req, res, next) => {
  if (req.cookies.session) {
    next()
  } else {
    res.redirect('/login')
  }
}

exports.isLoggedin = (req, res, next) => {
  if (req.cookies.session) {
    res.status(401).send({
      message: "You already logged in"
    })
  } else {
    next()
  }
}