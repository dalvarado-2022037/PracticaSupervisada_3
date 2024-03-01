'use stric'

import category from '../category/category.model.js'
import Comment from '../comentario/comment.model.js'
import Publication from './public.model.js'

export const test = (req, res)=>{
    res.send({message: 'Connected to publication'})
}

export const addPublication = async(req, res)=>{
    try{
        let { uid } = req.user
        let data = req.body
        //Validamos si vienen datos por cualquier cosa
        if(!data) 
            return res.status().send({message: 'No data sent'})
        //Validamos que exista la categoria
        let categoria = await category.findOne({_id:data.categoria})
        if(!categoria)
            return res.status(404).send({message: 'Category not found'})
        data.user = uid
        let publication = new Publication(data)
        try{
            await publication.save()
        }catch(err){
            console.error(err)
            return res.status(500).send({message: 'Error saving user respect all data'}) 
        }
        return res.send({message: 'Saved publication'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error connecting to addPublication'}) 
    }
}

export const lookAllPublication = async(req, res)=>{
    try{
        let publications = await Publication.find({}).populate('user', ['userName'])

        // Mapear las publicaciones para ajustar su formato
        // La funcion map sirve para transformar cada elemento de un array y devolver un nuevo array 
        // Con los cambios en la funcion, es como reconfigurar todo
        publications = publications.map(publication => {
            // Obtener la cantidad de likes y dislikes
            const likeCount = publication.like.length
            const dislikeCount = publication.dislike.length

            // Crear un objeto con el formato deseado
            return {
                userName: publication.user.userName, // Nombre del usuario
                titulo: publication.titulo, // Título de la publicación
                textoprincipal: publication.textoprincipal, // Texto principal de la publicación
                likeCount: likeCount, // Cantidad de likes
                dislikeCount: dislikeCount // Cantidad de dislikes
            }
        })

        return res.send({message: 'Publications: ', publications})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error connecting to lookAllPublication'}) 
    }
}

export const lookAtMyPosts = async(req, res)=>{
    try{
        let { uid } = req.user
        let publications = await Publication.find({user:uid})
        // Mapear las publicaciones para ajustar su formato
        // La funcion map sirve para transformar cada elemento de un array y devolver un nuevo array 
        // Con los cambios en la funcion, es como reconfigurar todo
        publications = publications.map(publication => {
            // Obtener la cantidad de likes y dislikes
            const likeCount = publication.like.length
            const dislikeCount = publication.dislike.length

            // Crear un objeto con el formato deseado
            return {
                userName: publication.user.userName, // Nombre del usuario
                titulo: publication.titulo, // Título de la publicación
                textoprincipal: publication.textoprincipal, // Texto principal de la publicación
                likeCount: likeCount, // Cantidad de likes
                dislikeCount: dislikeCount // Cantidad de dislikes
            }
        })

        return res.send({message: 'Publications: ', publications})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error connecting to lookAtMyPosts'}) 
    }
}

export const lookAtPosts = async(req, res)=>{
    try{
        let { id } = req.params
        let publications = await Publication.find({_id: id})
        // Mapear las publicaciones para ajustar su formato
        // La funcion map sirve para transformar cada elemento de un array y devolver un nuevo array 
        // Con los cambios en la funcion, es como reconfigurar todo
        publications = publications.map(publication => {
            // Obtener la cantidad de likes y dislikes
            const likeCount = publication.like.length
            const dislikeCount = publication.dislike.length

            // Crear un objeto con el formato deseado
            return {
                userName: publication.user.userName, // Nombre del usuario
                titulo: publication.titulo, // Título de la publicación
                textoprincipal: publication.textoprincipal, // Texto principal de la publicación
                likeCount: likeCount, // Cantidad de likes
                dislikeCount: dislikeCount // Cantidad de dislikes
            }
        })

        return res.send({message: 'Publications: ', publications})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error connecting to lookAtMyPosts'}) 
    }
}

export const updatePublication = async(req, res)=>{
    try{
        let { id } = req.params
        let publication = await Publication.findOne({_id:id})
        if(!publication) 
            return res.status(404).send({message: 'The publication has not been found'})
        
        let { uid } = req.user
        if(publication.user!=uid) 
            return res.status(404).send({message: 'You cannot modify other people`s posts'})
        
        let data = req.body
        let publicationUpdate = await Publication.findOneAndUpdate(
            {_id:id},
            data,
            {new: true})
        
        if(!publicationUpdate) 
            return res.status(404).send({message: 'Internal error could not update'})
        
        return res.send({message: 'Post updated successfully', publicationUpdate})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error connecting to updatePublication'}) 
    }
}

export const deletePublication = async(req, res)=>{
    try{
        let { uid } = req.user
        let { id } = req.params
        
        let publication = await Publication.findOne({_id:id})
        if(!publication) 
            return res.status(404).send({message: 'The publication has not been found'})
        
        if(publication.user!=uid) 
            return res.status(401).send({message: 'You cannot delete other people`s posts'})

        let publicationDelete = await Publication.findOneAndDelete({_id:id})
        if(!publicationDelete)
            return res.status(404).send({message: 'Internal error could not deleted publication'})

        let commentDelete = await Comment.deleteMany({publication: id})
        if(!commentDelete)
            return res.status(404).send({message: 'Internal error could not deleted comment'})
        
        return res.send({message: `The publication ${publicationDelete.titulo} delete successfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error connecting to deletePublication'}) 
    }
}

export const likePublication = async(req, res)=>{
    try{
        let { uid } = req.user
        let { id } = req.params

        let publication = await Publication.findOne({_id:id})
        if(!publication) 
            return res.status(404).send({message: 'The publication has not been found'})

        //Dado el caso no hay datos en likes
        if (!publication.like)
            // Inicializa la lista de likes si aún no existe
            publication.like = [] 

        //Dado el caso no hay datos en dislikes
        if (!publication.dislike)
            // Inicializa la lista de dislikes si aún no existe
            publication.dislike = [] 
            
        if(publication.like.includes(uid)){
            if(publication.dislike.includes(uid))
                publication.dislike = publication.dislike.filter(item => item != uid);
            publication.like = publication.like.filter(item => item != uid);
            await publication.save()
            let cantidad =  publication.like.length
            let discantidad = publication.dislike.length
            return res.send({message: `Number of likes: ${cantidad} Number of dislike: ${discantidad}`})
        }

        if(publication.dislike.includes(uid))
            publication.dislike = publication.dislike.filter(item => item != uid);
        publication.like.push(uid)
        await publication.save()
        let cantidad =  publication.like.length
        let discantidad = publication.dislike.length
        return res.send({message: `Number of likes: ${cantidad} Number of dislike: ${discantidad}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error connecting to likePublication'}) 
    }
}

export const dislikePublication = async(req, res)=>{
    try{
        let { uid } = req.user
        let { id } = req.params

        let publication = await Publication.findOne({_id:id})
        if(!publication) 
            return res.status(404).send({message: 'The publication has not been found'})

        //Dado el caso no hay datos en dislikes
        if (!publication.dislike)
            // Inicializa la lista de dislikes si aún no existe
            publication.dislike = [] 

        //Dado el caso no hay datos en likes
        if (!publication.like)
            // Inicializa la lista de likes si aún no existe
            publication.like = [] 
            
        if(publication.dislike.includes(uid)){
            if(publication.like.includes(uid))
                publication.like = publication.like.filter(item => item != uid);
            publication.dislike = publication.dislike.filter(item => item != uid);
            await publication.save()
            let cantidad =  publication.like.length
            let discantidad = publication.dislike.length
            return res.send({message: `Number of likes: ${cantidad} Number of dislike: ${discantidad}`})
        }

        if(publication.like.includes(uid))
            publication.like = publication.like.filter(item => item != uid);
        publication.dislike.push(uid)
        await publication.save()
        let cantidad =  publication.like.length
        let discantidad = publication.dislike.length
        return res.send({message: `Number of likes: ${cantidad} Number of dislike: ${discantidad}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error connecting to dislikePublication'}) 
    }
}