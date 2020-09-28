const router = require("express").Router()
const User = require("../models/userModel")
const bcrypt = require("bcryptjs")
const auth = require("../middleware/auth")
const jwt = require('jsonwebtoken')

router.post("/register", async(req, res) => {
    try{
    let {email, password, passwordCheck, firstName, lastName} = req.body;
    if(!email || !password || !passwordCheck || !firstName || !lastName)
    {
        return res.status(400).json({"msg":"Not all fields have been entered"})
    }
    if(password.length < 5)
    {
        return res.status(400).json({ "msg": "The password needs to be atleast 5 characters long"})
    }
    if(password.length > 30 )
    {
        return res.status(400).json({ "msg": "The password cannot be more than 30 characters long" })
    }
    if(password !== passwordCheck)
    {
        return res.status(400).json({ "msg": "Enter the same password twice for verification"})
    }
    const existingUser = await User.findOne({email: email})
    if(existingUser)
    {
        return res.status(400).json({ "msg" : "An account with this email already exists."})
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt)
    const newUser = new User({
        email,
        password: passwordHash,
        firstName,
        lastName
    })
    const savedUser = await newUser.save()
    res.json(savedUser)
    }
    catch(err)
    {
        res.status(500).json({error: err.message});
    }
})

router.post("/registerGoogle", async (req, res) => {
    try {
        let { email,firstName, lastName } = req.body;
        if (!email || !firstName || !lastName) {
            return res.status(400).json({ "msg": "Not all fields have been entered" })
        }
        
        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({ "msg": "An account with this email already exists." })
        }

        const newUser = new User({
            email,
            firstName,
            lastName
        })
        const savedUser = await newUser.save()
        res.json(savedUser)
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.post("/login", async(req, res) => {
    try{
        const {email, password} = req.body

        if(!email || !password) {
            return res.status(400).json({ "msg": "Not all fields have been entered." })
        }
        const user = await User.findOne({email: email})
        if(!user)
        {
            return res.status(400).json({ "msg": "No account with this account has been registered" })
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch)
        {
            return res.status(400).json({ "msg": "Invalid credentials" })
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                todo: user.todo //
            }
        })
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.post("/loginGoogle", async (req, res) => {
    const {email} = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
        return res.status(400).json({ "msg": "No account with this account has been registered" })
    }
    try {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                todo: user.todo //
            }
        })
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.delete("/delete",auth, async(req, res) => {
    try{
        const deletedUser = await User.findByIdAndDelete(req.user)
        res.json(deletedUser)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.post("/tokenIsValid",auth, async(req, res) => {
    try{
        const token = req.header("x-auth-token")
        if(!token) return res.json(false)

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if(!verified) return res.json(false)

        const user = await User.findById(verified.id)
        if(!user) return res.json(false)

        return res.json(true)
    }catch(err) {
        res.status(500).json({ error: err.message });
    }
})

router.get('/', auth, async(req, res) => {
    const user = await User.findById(req.user)
    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        todo: user.todo,
        id: user._id //
    })
})

module.exports = router