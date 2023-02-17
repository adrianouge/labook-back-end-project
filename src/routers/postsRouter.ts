import express from "express"
import { PostsBusiness } from "../business/PostsBusiness"
import { PostsController } from "../controllers/PostsController"
import { PostsDatabase } from "../database/PostsDatabase"
import { PostsDTO } from "../dtos/PostsDTO"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export const postsRouter = express.Router()

const postsController = new PostsController(
    new PostsBusiness(
        new PostsDatabase(),
        new PostsDTO(),
        new TokenManager(),
        new IdGenerator()
    ),
    new PostsDTO()
)

postsRouter.post('/', postsController.createNewPost)
postsRouter.post('/:id', postsController.likeDislikePost)
postsRouter.get('/', postsController.getPosts)
postsRouter.put('/:id', postsController.editPost)
postsRouter.delete('/:id', postsController.deletePost)