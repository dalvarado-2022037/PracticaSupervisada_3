import { Router } from 'express'
import { addComment, deleteCommen, dislikeComment, likeComent, lookAtPostsComment, test, updateComment } from './comment.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.get('/test', test)
api.post('/addComment/:id', [validateJwt], addComment)
api.put('/updateComment/:id', [validateJwt], updateComment)
api.delete('/deleteCommen/:id', [validateJwt], deleteCommen)
api.put('/likeComent/:id', [validateJwt], likeComent)
api.put('/dislikeComment/:id', [validateJwt], dislikeComment)
api.get('/lookAtPostsComment/:id', [validateJwt], lookAtPostsComment)

export default api