'use stric'

import Comment from './comment.model.js'
import Publication from '../publicacion/public.model.js'
import User from '../user/user.modul.js'

export const test = (req, res)=>{
    res.send({message: 'Connected to comment'})
}

export const addComment = async(req, res)=>{
    try{
        let { uid } = req.user
        let { id } = req.params
        let data = req.body
        let publication = await Publication.findOne({_id:id})
        if(!publication) 
            return res.status(404).send({message: 'Publication not found'})
        data.user = uid
        data.publication = id
        let comment = new Comment(data)
        try{
            await comment.save()
        }catch(err){
            console.error(err)
            return res.status(500).send({message: 'Error save to comment'}) 
        }
        return res.send({message: 'Saved comment'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error connecting to addComment'}) 
    }
}

export const updateComment = async(req, res)=>{
    try{
        let { uid } = req.user
        let { id } = req.params
        let data = req.body
        let comment = await Comment.findOne({_id:id})
        if(!comment) 
            return res.status(404).send({message: 'Comment not found'})

        if(comment.user != uid) 
            return res.status(401).send({message: 'You cannot modify other people`s comments'})

        if(data.user || data.publication) 
            return res.status(401).send({message: 'You cannot alter this data'})

        let commentUpdate = await Comment.findOneAndUpdate(
        {_id: id},
        data,
        {new: true})
        if(!commentUpdate) 
            return res.status(404).send({message: 'Internal error could not update'})
        
        return res.send({message: 'Comment updated successfully', commentUpdate})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error connecting to updateComment'}) 
    }
}

export const deleteCommen = async(req, res)=>{
    try{
        let { id } = req.params
        let { uid } = req.user
        let comment = await Comment.findOne({_id:id})
        if(!comment) 
            return res.status(404).send({message: 'Comment not found'})
        if(comment.user !=uid) 
            return res.status(401).send({message: 'You cannot modify other people`s comments'})
        let commentDelete = await Comment.findOneAndDelete({_id:id})
        if(!commentDelete) 
            return res.status(404).send({message: 'Internal error could not delete'})
        return res.send({message: `The comment delete successfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error connecting to deleteCommenS'}) 
    }
}

export const likeComent = async(req, res)=>{
    try{
        let { uid } = req.user
        let { id } = req.params

        let comment = await Comment.findOne({_id:id})
        if(!comment) 
            return res.status(404).send({message: 'The comment has not been found'})

        //Dado el caso no hay datos en likes
        if (!comment.like)
            // Inicializa la lista de likes si aún no existe
            comment.like = [] 

        //Dado el caso no hay datos en dislikes
        if (!comment.dislike)
            // Inicializa la lista de dislikes si aún no existe
            comment.dislike = [] 
            
        if(comment.like.includes(uid)){
            if(comment.dislike.includes(uid))
                comment.dislike = comment.dislike.filter(item => item != uid);
            comment.like = comment.like.filter(item => item != uid);
            await comment.save()
            let cantidad =  comment.like.length
            let discantidad = comment.dislike.length
            return res.send({message: `Number of likes: ${cantidad} Number of dislike: ${discantidad}`})
        }

        if(comment.dislike.includes(uid))
            comment.dislike = comment.dislike.filter(item => item != uid);
        comment.like.push(uid)
        await comment.save()
        let cantidad =  comment.like.length
        let discantidad = comment.dislike.length
        return res.send({message: `Number of likes: ${cantidad} Number of dislike: ${discantidad}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error connecting to likeComent'}) 
    }
}

export const dislikeComment = async(req, res)=>{
    try{
        let { uid } = req.user
        let { id } = req.params

        let comment = await Comment.findOne({_id:id})
        if(!comment) 
            return res.status(404).send({message: 'The comment has not been found'})

        //Dado el caso no hay datos en deslike
        if (!comment.deslike)
            // Inicializa la lista de deslike si aún no existe
            comment.deslike = [] 

        //Dado el caso no hay datos en likes
        if (!comment.like)
            // Inicializa la lista de likes si aún no existe
            comment.like = [] 
            
        if(comment.deslike.includes(uid)){
            if(comment.like.includes(uid))
                comment.like = comment.like.filter(item => item != uid);
            comment.deslike = comment.deslike.filter(item => item != uid);
            await comment.save()
            let cantidad =  comment.like.length
            let discantidad = comment.deslike.length
            return res.send({message: `Number of likes: ${cantidad} Number of deslike: ${discantidad}`})
        }

        if(comment.like.includes(uid))
            comment.like = comment.like.filter(item => item != uid);
        comment.deslike.push(uid)
        await comment.save()
        let cantidad =  comment.like.length
        let discantidad = comment.deslike.length
        return res.send({message: `Number of likes: ${cantidad} Number of deslike: ${discantidad}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error connecting to dislikeComment'}) 
    }
}

export const lookAtPostsComment = async(req, res)=>{
    try{
        let { id } = req.params
        let comment = await Comment.find({publication: id}).populate('publication').populate('user')
        let { userName } = await User.findOne({_id:comment[1].publication.user})

        comment = comment.map(comment => {
            const likeCountComment = comment.like.length
            const dislikeCountComment = comment.deslike.length
            const likeCountPublicate = comment.publication.like.length
            const dislikeCountPublicate = comment.publication.dislike.length

            let publicationComplete = {
                userName: userName,
                titulo: comment.publication.titulo,  
                textoprincipal: comment.publication.textoprincipal,
                likeCount: likeCountPublicate, 
                dislikeCount: dislikeCountPublicate,
                userNameComment: comment.user.userName,
                content: comment.content,
                likeCountComment: likeCountComment, 
                dislikeCountComment: dislikeCountComment,
            }
            return publicationComplete
        })

        return res.send({message: 'Publications: ', comment})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error connecting to lookAtMyPosts'}) 
    }
}