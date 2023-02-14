import { Request, Response } from "express";
import { PostsBusiness } from "../business/PostsBusiness";
import { PostsDTO } from "../dtos/PostsDTO";

export class PostsController {

    constructor(
        private postsBusiness: PostsBusiness,
        private postsDTO: PostsDTO
    ) { }

    public getPosts = async (req: Request, res: Response) => {

        try {
            const q = req.query.q as string | undefined
            const output = await this.postsBusiness.getPosts(q)

            res.status(200).send(output)
        }

        catch (error) {
            console.log(error)

            if (res.statusCode === 200) { res.status(500) }

            if (error instanceof Error) { res.send(error.message) }

            else { res.send("Unexpected error ocured.") }
        }
    }

    public createNewPost = async (req: Request, res: Response) => {

        try {
            const { id, creator_id, content } = req.body

            const checkedTypesPostTBC = this.postsDTO.createNewPostInput(id, creator_id, content)
            const createPostSuccessful = await this.postsBusiness.createNewPost(checkedTypesPostTBC)

            res.status(201).send(createPostSuccessful)
        }

        catch (error) {
            console.log(error)

            if (res.statusCode === 200) { res.status(500) }

            if (error instanceof Error) { res.send(error.message) }

            else { res.send("Unexpected error occured.") }
        }
    }

    public editPost = async (req: Request, res: Response) => {
        try {
            const postToBeEditedID = req.params.id
            const newContent = req.body.newContent
            const checkedInfoToEdit = this.postsDTO.editPostInput(postToBeEditedID, newContent)
            const editPostSuccessful = await this.postsBusiness.editPost(checkedInfoToEdit)

            res.status(200).send(editPostSuccessful)
        }

        catch (error) {
            console.log(error)

            if (res.statusCode === 200) { res.status(500) }

            if (error instanceof Error) { res.send(error.message) }

            else { res.send("Unexpected error occured.") }
        }
    }

    public deletePost = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const checkedTypeId = this.postsDTO.deletePostInput(id)
            const deletePostSuccessful = await this.postsBusiness.deletePost(checkedTypeId)

            res.status(200).send(deletePostSuccessful)
        }

        catch (error) {
            console.log(error)

            if (res.statusCode === 200) { res.status(500) }

            if (error instanceof Error) { res.send(error.message) }

            else { res.send("Unexpected error occured.") }
        }
    }
}