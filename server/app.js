const express = require("express")
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const path = require('path')
const fs = require('fs')


const port = process.env.APP_PORT
const public = process.env.PUBLIC
const user_data = process.env.USER_DATA
const authMiddleware = process.env.AUTH_Middleware
const {
    Auth,
    checkSession,
    isLoggedin
} = require(authMiddleware)

app.use(express.static(public))
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.text({
    type: 'application/json'
}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const urlEncoded = bodyParser.urlencoded({
    extended: false
});
const {
    userGame,
    userGameBiodata,
    userGameHistory
} = require('./models')
const users = JSON.parse(fs.readFileSync(user_data, 'utf-8'))

// Views
app.get('/', checkSession, async (req, res) => {
    try {
        const userGames = await userGame.findAll({
            where: {},
            order: [
                ['updatedAt', 'desc'],
                ['createdAt', 'desc']
            ],
            include: [{
                model: userGameBiodata
            }, {
                model: userGameHistory
            }]
        })
        res.render('dashboard/index', {
            userGames,
            session_username: req.cookies.session
        })
    } catch (error) {
        console.log(error)
        res.status(500).send('error')
    }
})

app.get('/login', isLoggedin, (req, res) => {
    res.render('dashboard/login')
})

app.post('/login', isLoggedin, Auth, (req, res) => {
    res.redirect('/')
})

app.get('/create', checkSession, (req, res) => {
    res.render('dashboard/create')
})

app.get('/create/usergamehistory/:id', checkSession, (req, res) => {
    userGame.findByPk(req.params.id)
        .then(usergame => {
            if (!usergame) {
                res.redirect('/')
            } else {
                res.render('dashboard/usergamehistory/create', {
                    usergame: usergame
                })
            }
        })
})

app.get('/edit/:id', checkSession, (req, res) => {
    userGame.findByPk(req.params.id, {
            include: [{
                    model: userGameBiodata,
                    required: false
                },
                {
                    model: userGameHistory,
                    required: false
                }
            ]
        })
        .then(usergame => {
            if (!usergame) {
                res.status(404).send({
                    Message: "Data not found"
                })
            } else {
                res.render('dashboard/edit', {
                    usergame: usergame
                })
            }
        })
        .catch(error => {
            res.send({
                message: "Error retrieving data"
            })
        })
})


// API
app.post("/api/create", checkSession, async (req, res) => {
    try {
        let usergame = await userGame.create({
            username: req.body.username,
            password: req.body.password
        });
        let usergamebiodata = await userGameBiodata.create({
            userId: usergame.id,
            fullName: 'Full name is not set',
            email: 'Email is not set',
            dateofbirth: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        })
        let usergamehistory = await userGameHistory.create({
            userId: usergame.id,
            game: 'none',
            score: 0,
            level: 0,
            lastLogin: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        })
        res.redirect('/');
    } catch (error) {
        res.render('dashboard/create', {
            error: error
        });
    }
});

app.post("/api/create/usergamehistory", checkSession, async (req, res) => {
    try {
        const usergame = await userGame.findByPk(req.body.usergameId);
        const usergamehistory = await userGameHistory.create({
            game: req.body.game,
            score: req.body.score,
            level: req.body.level,
            lastLogin: req.body.lastLogin,
            userId: req.body.userId
        });

        res.redirect('/');
    } catch (error) {
        res.render('dashboard/create', {
            error: error
        });
    }
});

app.post("/api/edit/usergame", checkSession, async (req, res) => {
    try {
        let usergame = await userGame.findByPk(req.body.id)
        usergame.username = req.body.username ? req.body.username : usergame.username;
        usergame.password = req.body.password ? req.body.password : usergame.password;
        await usergame.save();
        res.redirect('/');
    } catch (error) {
        res.render("dashboard/edit", {
            error: error
        });
    }
});

app.post("/api/edit/usergamebiodata", checkSession, async (req, res) => {
    try {
        let usergamebiodata = await userGameBiodata.findOne({
            where: {
                userId: req.body.id
            },
            include: {
                model: userGame
            }
        })

        if (!usergamebiodata) {
            throw new Error("User Game Biodata not found.")
        }
        usergamebiodata.fullName = req.body.fullName ? req.body.fullName : usergamebiodata.fullName;
        usergamebiodata.email = req.body.email ? req.body.email : usergamebiodata.email;
        usergamebiodata.dateofbirth = req.body.dateofbirth ? req.body.dateofbirth : usergamebiodata.dateofbirth;

        await usergamebiodata.save()
        res.redirect('/')
    } catch (error) {
        res.render('dashboard/edit', {
            error: error
        });
    }
});

app.post("/api/edit/usergamehistory", checkSession, async (req, res) => {
    try {
        const usergamehistory = await userGameHistory.findAll({
            where: {
                userId: req.body.id
            },
        });

        usergamehistory.forEach((ugh, index) => {
            ugh.game = req.body[`game${index}`] ? req.body[`game${index}`] : ugh.game;
            ugh.score = req.body[`score${index}`] ? req.body[`score${index}`] : ugh.score;
            ugh.level = req.body[`level${index}`] ? req.body[`level${index}`] : ugh.level;
            ugh.lastLogin = req.body[`lastLogin${index}`] ? req.body[`lastLogin${index}`] : ugh.lastLogin;
        });

        await Promise.all(usergamehistory.map((ugh) => ugh.save()));
        res.redirect('/')
    } catch (error) {
        res.render("dashboard/edit", {
            error: error,
        });
    }
});

app.get("/api/delete/:id", async (req, res) => {
    try {
        const count = await userGame.destroy({
            where: {
                id: req.params.id
            }
        })

        if (count > 0) {
            return res.redirect('/');
        } else {
            return res.redirect('/');
        }

    } catch (err) {
        return res.redirect('/');
    }

});

app.get('/logout', checkSession, (req, res) => {
    res.clearCookie('session')
    res.redirect('/')
})

app.use((req, res) => {
    res.status(404).render('404')
})

app.listen(port, () => {
    console.log(`App running on localhost:${port}`)
})