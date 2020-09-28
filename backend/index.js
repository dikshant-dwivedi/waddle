const express =  require("express")
const mongoose = require("mongoose")
const cors =  require("cors")
require("dotenv").config()

//setup express

const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`The console has started on port: ${PORT}`));

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }, (error) => {
        if(error) throw error
        console.log("mongodb connection established")
    })

app.use("/users", require("./routes/userRouter"));      
app.use("/todos", require("./routes/todoRouter"));      