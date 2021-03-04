const fs=require('fs')
const db = require("../config/database")

exports.getMainPage=(req,res)=>{
    let sql="SELECT * FROM players ORDER BY ID ASC"

    db.query(sql,(err,result)=>{
        if(err){
            res.redirect('/players')
        }

        res.render('index.ejs',{title:'Welcome to Football | View Players',players:result})
    })
}

exports.addPlayerPage=(req,res)=>{
    res.render('add-player.ejs',{
        title:'Welcome to Football | Add a new Player',message:''})

}

exports.addPlayer=(req,res)=>{
    if(!req.files){
        return res.status(400).send("No files were uploaded")
    }
    let message= ''
    let first_name=req.body.first_name
    let last_name=req.body.last_name
    let position=req.body.position
    let number=req.body.number
    let user_name=req.body.user_name
    let uploadedFile=req.files.image
    let image_name=uploadedFile.name
    let fileExtension=uploadedFile.mimetype.split('/')[1]
    image_name =user_name+'.'+fileExtension

    let usernameSql="SELECT * FROM players WHERE user_name='"+user_name+"'"

    db.query(usernameSql,(err,result)=>{
        if(err){
            return res.status(500).send(err)
        }
        if(result.length>0){
            message='Username already exists'
            res.render('add-player.ejs',{message,title:'Welcome to Football | Add a new Player'
        })

        }else{
            if(uploadedFile.mimetype==='image/png' || uploadedFile.mimetype==='image/jpeg' || uploadedFile.mimetype==='image/gif'){
                uploadedFile.mv(`public/asset/img/${image_name}`,(err)=>{
                    if(err){
                    return res.status(500).send(err)
                    }
                    let sql="INSERT INTO players(first_name,last_name,position,number,image,user_name) VALUES('"+first_name+"','"+last_name+"','"+position+"','"+number+"','"+image_name+"','"+user_name+"')"

                    db.query(sql,(err,result)=>{
                        if(err){
                            return res.status(500).send(err)
                        }
                        res.redirect('/players')

                    })
                })
            } 
            else{
                message="Invalid File format.Only 'gif','jpeg','png' images are allowed."
                res.render('add-player.ejs',{title:'Welcome to Football | Add a new Player'})

            }

        }
    })
}

exports.editPlayerPage=(req,res)=>{
    let id=req.params.id
    
    let sql="SELECT * FROM players WHERE id='"+id+"'"
    db.query(sql,(err,result)=>{
        if(err){
            return res.status(500).send(err)
        }
        res.render('edit-player.ejs',{title:'Edit Player',player:result[0],message:''})
    })

}

exports.editPlayer=(req,res)=>{
    let id=req.params.id
    let first_name=req.body.first_name
    let last_name=req.body.last_name
    let position=req.body.position
    let number=req.body.number

    let sql="UPDATE players SET first_name='"+first_name+"' ,last_name='"+last_name+"',position='"+position+"',number='"+number+"' WHERE id='"+id+"'"

    db.query(sql,(err,result)=>{
        if(err){
            return res.status(500).send(err)
        }

        res.redirect('/players')
    })
}

    exports.deletePlayer=(req,res)=>{
        let id=req.params.id
        let imagesql="SELECT image FROM players WHERE id='"+id+"'"
        let sql="DELETE FROM players WHERE id='"+id+"'"

        db.query(imagesql,(err,result)=>{
            if(err){
                return res.status(500).send(err)
            }

            let image=result[0].image
            fs.unlink(`public/asset/img/${image}`,(err)=>{
                if(err){
                    return res.status(500).send(err)
                }
                db.query(sql,(err,result)=>{
                    if(err){
                        return res.status(500).send(err)
                    }
                    res.redirect('/players')})
            })

        })

    }

