const router = require("express").Router()
const User = require("../models/userModel")

router.post("/add", async (req, res) => {
    try {
        const { id, todo } = req.body
        let user = await User.findById(id)
        user.todo.push(todo)
        const savedUser = await user.save()
        //const newTodo = savedUser.todo.filter(itodo => itodo.id === id)
        const newTodo = savedUser.todo[savedUser.todo.length-1]
        res.json(newTodo)
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.post("/delete", async (req, res) => {
    try {
        const { id , todoId} = req.body
        let user = await User.findById(id)
        //const deletedTodo = await user.todo.pull({_id: todoId})
        user.todo.pull(todoId)
        const savedUser = await user.save()
        res.json(savedUser)
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.post("/markComplete", async (req, res) => {
    try {
        const { id, todoId , isCompleted} = req.body
        //const deletedTodo = await user.todo.pull({_id: todoId})
        User.findOneAndUpdate({
            "_id": id,
            "todo._id": todoId
        }, {
            "$set": {
                "todo.$.isCompleted": isCompleted
            }
        }, function (error, success) {
                if (error) throw error

                res.json({
                    message: 'Success'
                })
        })
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})
router.post("/edit", async (req, res) => {
    try {
        const { id, todoId, title } = req.body
        //const deletedTodo = await user.todo.pull({_id: todoId})
        User.findOneAndUpdate({
            "_id": id,
            "todo._id": todoId
        }, {
            "$set": {
                "todo.$.title": title
            }
        }, function (error, success) {
            if (error) throw error

            res.json({
                message: 'Success'
            })
        })
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})

/*router.get("/get", async(req, res)=> {
    try{
        const {id} = req.body
        const user = await User.findOne({email: email})
        let todo = user.todo
        todo["editDisabled"] = "false"
        res.json({
            id: user._id,
            todo: todo
        })
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
})*/
/*router.delete('/todos/:id', (req, res, next) => {
    Todo.findOneAndDelete({ "_id": req.params.id })
        .then(data => res.json(data))
        .catch(next)
})*/

module.exports = router;