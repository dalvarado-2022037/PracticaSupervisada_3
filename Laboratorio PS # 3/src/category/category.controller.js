'use strict'

import Category from './category.model.js'
import Publication from '../publicacion/public.model.js'

export const test = (req, res)=>{
    return res.send({message: 'Connect to category'})
}

export const categoriaDefault = async(req, res)=>{
    try{
        let categoriaDefault = await Category.findOne({name:'DEFAULT'})
        if(!categoriaDefault){
            let data = {
                name: 'DEFAULT',
                description: 'Product without category without register'
            }//65e227dd4a06bf34348eb778
            let categoria = new Category(data)
            await categoria.save()
        }
    }catch(err){
        console.error(err)
    }
}

export const addCategory = async(req, res)=>{
    try{
        let data = req.body
        let category = new Category(data)
        try{
            await category.save()
        }catch(err){
            console.error(err)
            return res.status(500).send({message: 'Error save to category'}) 
        }
        return res.send({message: 'Saved category'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error connecting to addCategory'}) 
    }
}

export const updateCategory = async(req, res)=>{
    try{
        let { id } = req.params
        let data = req.body
        let categoryExiste = await Category.findOne({_id:id})
        if(!categoryExiste)
            return res.status(404).send({message: 'Category not found'})
        let categoryUpdate = await Category.findOneAndUpdate(
            {_id:id},
            data,
            {new: true})
        if(!categoryUpdate)
            return res.status(404).send({message: 'Internal error could not update'})
        return res.send({message: 'Category updated successfully', categoryUpdate})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error connecting to updateCategory'}) 
    }
}

export const deleteCategory = async(req, res)=>{
    try{
        let { id } = req.params
        let categoryExiste = await Category.findOne({_id:id})
        let categoriDefault = await Category.findOne({name:'DEFAULT'})

        if(!categoryExiste)
            return res.status(404).send({message: 'Category not found'})

        let publicationUpdate = await Publication.find({categoria:id})

        for (let i = 0; i < publicationUpdate.length; i++) {
            let publicacion = publicationUpdate[i]
            publicacion.categoria = categoriDefault._id
            await publicacion.save()
        }

        let categoryDelete = await Category.findOneAndDelete({_id:id})
        if(!categoryDelete)
            return res.status(404).send({message: 'Internal error could not delete'})
        return res.send({message: `The category delete successfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error connecting to deleteCategory'}) 
    }
}

export const viewAllCategory = async(req, res)=>{
    try{
        let category = await Category.find({})
        return res.send({message: 'The categorys: ', category})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error connecting to viewAllCategory'}) 
    }
}

export const viewCategory = async(req, res)=>{
    try{
        let { id } = req.params
        let category = await Category.find({_id: id})
        return res.send({message: 'The categorys: ', category})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error connecting to viewCategory'}) 
    }
}