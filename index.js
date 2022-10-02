const express = require('express')
const bodyparser = require("body-parser")
const mongoose = require('mongoose')
const path = require('path')
const {
    getEnabledCategories
} = require('trace_events')

const app = express()
const port = process.env.PORT || 3000

const session = require('express-session')

app.use(bodyparser.json())

app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
}))

app.use(bodyparser.urlencoded({
    extended: true
}))

// Tells our app to keep in mind the folder called "public", where we have various assets
app.use(express.static(__dirname + '/public'))

const usersSchema = new mongoose.Schema({
    user_id: Number,
    username: String,
    password: String,
    isAdmin: Boolean,
    profile_desc: String,
    profile_img_url: String,
    full_name: String,
    points: Number,
    days_worked: Number,
    current_location: String,
    calendar: [Object],
    rewards_pending: [Object],
    rewards_redeemed: [Object],
}, {
    collection: 'users'
})

const usersModel = mongoose.model("users", usersSchema);


const rewardsSchema = new mongoose.Schema({
    reward_name: String,
    reward_desc: String,
    reward_img_url: String,
    reward_cost: Number
}, {
    collection: 'rewards'
})

const rewardsModel = mongoose.model("rewards", rewardsSchema);

const calendarDaysSchema = new mongoose.Schema({
    date: String,
    location: String,
    user_id: [Number]
}, {
    collection: 'calendar_days'
})

const calendarDaysModel = mongoose.model("calendar_days", calendarDaysSchema);

mongoose.connect("mongodb+srv://juan:Rocco123@cluster0.nxfhi.mongodb.net/My-SAP-Rewards?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.get('/', authenticate, (req, res) => {
    res.sendFile(__dirname + '/public/views/dashboard.html')
})

app.get('/schedule', authenticate, (req, res) => {
    res.sendFile(__dirname + '/public/views/schedule.html')
})

app.get('/profile', authenticate, (req, res) => {
    res.sendFile(__dirname + '/public/views/profile.html')
})

app.get('/admin', authenticateAndCheckIfAdmin, (req, res) => {
    res.sendFile(__dirname + '/public/views/admin.html')
})

// This is a get route that does not need the middleware authenticator (it would make an infinite loop)
app.get('/login', (req, res) => {
    // If they're authenticated, send them to their profile, otherwise send them to the login page
    if (req.session.authenticated) {
        res.redirect('/profile')
    } else {
        res.sendFile(__dirname + '/public/views/login.html')
    }
})

// Checks if the user is authenticated, and either executes the next function or redirects to login
function authenticate(req, res, next) {
    if (req.session.authenticated) {
        next()
    } else {
        res.redirect('/login')
    }
}

// Checks if the user is authenticated, and either executes the next function or redirects to login
function authenticateAndCheckIfAdmin(req, res, next) {
    if (req.session.authenticated && req.session.user.isAdmin) {
        next()
    } else {
        res.redirect('/')
    }
}

// Logs in a user by authenticating
app.post('/login', async (req, res) => {
    await authenticateLogin(req.body.username, req.body.password).then(user => {
        if (user) {
            req.session.user = user
            req.session.isAdmin = user.isAdmin
            req.session.points = user.points
        }
    })
    req.session.authenticated = req.session.user != null
    res.json({
        success: req.session.authenticated,
        user: req.session.user,
        message: req.session.authenticated ? "Authentication success." : "Authentication failed."
    })
})

// Register a user into the database
app.post('/register', async (req, res) => {
    let userId = 100000000 + Math.floor(Math.random() * 10000);
    console.log(req.body.isAdmin)
    await usersModel.insertMany({
        username: req.body.username,
        password: req.body.password,
        isAdmin: req.body.isAdmin,
        profile_desc: "Hello, I'm " + req.body.username,
        profile_img_url: "", // todo insert default image
        full_name: "",
        points: 0,
        days_worked: 0,
        user_id: userId,
        current_location: "Nowhere",
        calendar: [],
        rewards_pending: [],
        rewards_redeemed: [],
    }).then((result, err) => {
        if (err) {
            res.json({
                success: false
            })
        } else {
            res.json({
                success: true
            })
        }
    })
})

async function authenticateLogin(username, password) {
    const users = await usersModel.find({
        username: username,
        password: password
    })
    return users[0]
}

app.get('/users/:userId', (req, res) => {
    usersModel.find({
        id: req.params.userId
    }, function (err, user) {
        if (err) {
            console.log("Error " + err)
        }
        res.json(user)
    });
})

app.get('/pendingrewards/:userId', async (req, res) => {
    const user = await usersModel.find({
        user_id: req.params.userId
    })
    return res.json(user[0].rewards_pending);
})

app.get('/redeemedrewards/:userId', async (req, res) => {
    const user = await usersModel.find({
        user_id: req.params.userId
    })
    return res.json(user[0].rewards_redeemed);
})

app.post('/redeem', async (req, res) => {
    res.json(await redeem(req.body.userId, req.body.rewardName, req.body.rewardCost))
})

app.post('/select', async (req, res) => {
    res.json(await select(req.body.userId, req.body.rewardName, req.body.rewardCost))
})

app.post('/loaddate', async (req, res) => {
    res.json(await loadDate(req.body.dateNumber, req.body.location))
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

app.post('/thisuser', async (req, res) => {
    const user = await usersModel.find({
        user_id: req.body.userId
    })
    return res.json(user[0]);
})

app.post('/userlist', async (req, res) => {
    const users = await usersModel.find({ })
    return res.json(users);
})

app.post('/rewardslist', async (req, res) => {
    const rewards = await rewardsModel.find({ })
    return res.json(rewards);
})

app.post('/deleteuser', async (req, res) => {
    let userId = req.body.userId
    if (Number(userId) === Number(req.session.user.user_id)) {
        return res.json({
            success: false,
            message: "Can't delete your own account!"
        })
    } else {
        await usersModel.deleteOne({ user_id: userId }).then(
            res.json({
                success: true,
                message: "Successfully deleted the account!"
            })
        )
    }   
})

async function select(userId, rewardName, rewardCost) {
    let reward = await rewardsModel.find({
        reward_name: rewardName
    });
    
    await usersModel.updateOne({
        user_id: userId
    }, {
        desired_reward_cost: rewardCost
    });
    return "{success: true}";
}

async function redeem(userId, rewardName, rewardCost) {
    let reward = await rewardsModel.find({
        reward_name: rewardName
    });
    
    let user = await usersModel.updateOne({
        user_id: userId
    }, {
        $inc: {
            points: rewardCost * -1
        },
        $push: {
            rewards_pending: reward[0]
        }
    });
    return `{ new_point_balance: ${user.points - rewardCost} }`;
}

async function loadDate(dateNumber, location) {
    let calendarDay = await calendarDaysModel.find({
        // The date is hard-coded for now
        date: "09-0" + dateNumber + "-2022"
    });
    
    console.log(calendarDay);
    if (calendarDay[0] == undefined) {
        return "{}";
    }

    return calendarDay[0];
}