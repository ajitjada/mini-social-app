const express = require('express')
const app = express()
const userModel = require('./models/user')
const postModel = require('./models/post')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const upload = require('./config/multerconfig')
const cors = require('cors')

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())

app.post('/upload', isloggedIn, upload.single("image"), async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email })
    user.profilepic = req.file.filename
    await user.save()
    res.json({ message: "Profile picture updated", user })
})

app.post('/register', async (req, res) => {
    let { email, username, name, password, age } = req.body
    let user = await userModel.findOne({ email })
    if (user) return res.status(400).json({ message: "User already registered" })

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let newUser = await userModel.create({
                username,
                name,
                email,
                age,
                password: hash
            })
            let token = jwt.sign({ email: email, userid: newUser._id }, "tumtumtaunav")
            res.cookie("token", token, { httpOnly: true, sameSite: 'strict' })
            res.status(201).json({ message: "Registered successfully", user: newUser, token })
        })
    })
})

app.post('/login', async (req, res) => {
    let { email, password } = req.body
    let user = await userModel.findOne({ email }).populate("post")
    if (!user) return res.status(400).json({ message: "Invalid email or password" })

    bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            let token = jwt.sign({ email: email, userid: user._id }, "tumtumtaunav")
            res.cookie("token", token, { httpOnly: true, sameSite: 'strict' })
            res.status(200).json({ message: "Logged in successfully", user, token })
        }
        else {
            res.status(400).json({ message: "Invalid email or password" })
        }
    })
})

app.get('/profile', isloggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("post")
    res.json({ user })
})

app.get('/user/:id', isloggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ _id: req.params.id }).populate("post")
        if (!user) return res.status(404).json({ message: "User not found" })
        res.json({ user })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Something went wrong" })
    }
})

app.get('/posts', isloggedIn, async (req, res) => {
    let posts = await postModel.find().populate("user").sort({ "date.date": -1 })
    res.json({ posts })
})

app.post('/post', isloggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email })
    let { content } = req.body

    let post = await postModel.create({
        user: user._id,
        content
    })

    user.post.push(post._id)
    await user.save()

    // Populate the user so the frontend receives the user object
    await post.populate("user")

    res.status(201).json({ message: "Post created", post })
})

app.get('/like/:id', isloggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id }).populate("user")

    if (post.likes.indexOf(req.user.userid) === -1) {
        post.likes.push(req.user.userid)
    } else {
        post.likes.splice(post.likes.indexOf(req.user.userid), 1)
    }

    await post.save()
    res.json({ message: "Post liked/unliked", post })
})

app.delete('/post/:id', isloggedIn, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the logged-in user owns the post
        if (post.user.toString() !== req.user.userid) {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }

        // Delete the post
        await postModel.findByIdAndDelete(req.params.id);

        // Remove post reference from user
        await userModel.findByIdAndUpdate(req.user.userid, {
            $pull: { post: req.params.id }
        });

        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
});

app.post('/update/:id', isloggedIn, async (req, res) => {
    try {
        let post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.user.toString() !== req.user.userid) {
            return res.status(403).json({ message: "Unauthorized to update this post" });
        }
        
        post = await postModel.findOneAndUpdate({ _id: req.params.id }, { content: req.body.content }, { new: true }).populate("user")
        res.json({ message: "Post updated", post })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
})

app.get("/logout", (req, res) => {
    res.cookie("token", "")
    res.json({ message: "Logged out successfully" })
})  

function isloggedIn(req, res, next) {
    let token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1])

    if (!token) return res.status(401).json({ message: "You must be logged in" })

    try {
        let data = jwt.verify(token, "tumtumtaunav")
        req.user = data
        next()
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" })
    }
}

app.listen(3000, () => {
    console.log("Server listening on port 3000")
})