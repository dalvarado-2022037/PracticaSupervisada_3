import mongoose from 'mongoose'

const publicacionSchema = mongoose.Schema({
    titulo:{
        type: String,
        required: true
    },
    textoprincipal:{
        type: String,
        required: true
    },
    categoria:{
        type: mongoose.Schema.ObjectId,
        ref: 'category',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
    like: [{
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    }],
    dislike: [{
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    }],
})

export default mongoose.model('publication', publicacionSchema)