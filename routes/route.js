const router=require('express').Router()

const {
    getMainPage,
    addPlayerPage,
    addPlayer,
    editPlayerPage,
    editPlayer,
    deletePlayer
    }=require('../controllers/controller')

     router.get('/',getMainPage)
     router.get('/add',addPlayerPage)
     router.post('/add',addPlayer)
    router.get('/edit/:id',editPlayerPage)
    router.post('/edit/:id',editPlayer)
    router.get('/delete/:id',deletePlayer)

    module.exports=router
