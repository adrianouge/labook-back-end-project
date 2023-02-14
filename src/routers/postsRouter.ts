import express from "express"
import { PostsBusiness } from "../business/PostsBusiness"
import { PostsController } from "../controllers/PostsController"
import { PostsDatabase } from "../database/PostsDatabase"
import { PostsDTO } from "../dtos/PostsDTO"

export const postsRouter = express.Router()

const postsController = new PostsController(
    new PostsBusiness(
        new PostsDatabase(),
        new PostsDTO()
    ),
    new PostsDTO()
)

postsRouter.get('/', postsController.getPosts)
postsRouter.post('/', postsController.createNewPost)
postsRouter.put('/:id', postsController.editPost)
postsRouter.delete('/:id', postsController.deletePost)