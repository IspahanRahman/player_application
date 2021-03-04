require("dotenv").config()
const express=require('express')
const morgan=require('morgan')
const bodyparser=require('body-parser')
const path=require('path')
const fileUpload = require('express-fileupload');
const db=require('../player_application/config/database')

const router=require('./routes/route')

db.connect((err)=>{
    if(err){
    console.log(err)
    }

    console.log('MySql is connected')
  
})

const app=express()

app.set('views',__dirname +'/views')
app.set('view engine','ejs')
app.use(morgan('dev'))
app.use(express.urlencoded({extended:true}))
app.use(bodyparser.json())
app.use(express.static(path.join(__dirname,'public')))
app.use(fileUpload())



app.use('/players',router)

app.get('/createTable',(req,res)=>{
    let sql='CREATE TABLE IF NOT EXISTS players(id int auto_increment PRIMARY KEY,first_name varchar(255) not null,last_name varchar(255) not null,position varchar(255) not null, number int not null,image varchar(255) not null,user_name varchar(20) not null)'

    db.query(sql,(err,result)=>{
        if(err){
            throw err
        }

        console.log(result)
        res.send('<div style="background-color:#A29694;color:black;"><h1 align="center">Database Table Created</h1></div>')
    })
})

app.get('/',(req,res)=>{
    res.send('<div style="background-color:#A29694;color:black;"><h1 align="center">Player_Application Project with MySQL </h1></div>')

})

app.get('*',(req,res)=>{
    res.send('<div style="background-color:#A29694;color:black;"><h1 align="center">404 not found</h1></div>')
})


app.listen(process.env.APP_PORT,()=>{
    console.log(`Server is running on ${process.env.APP_PORT}`)
})