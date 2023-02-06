import { Request, Response } from "express";
import { PostsBusiness } from "../business/PostsBusiness";
import { PostsDatabase } from "../database/PostsDatabase";
import { Post } from "../models/Post";

export class PostsController {
   
    public getAllPosts = async (req: Request, res: Response) => {
        try {
            const q = req.query.q as string
            const postsBusiness = new PostsBusiness()
            const posts = await postsBusiness.getPosts(q)

            res.status(200).send(posts)
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
            const input = {
                id: req.body.id,
                creator_id: req.body.creator_id,
                content: req.body.content
            }
            const postsBusiness = new PostsBusiness()
            const createNewPost = await postsBusiness.createNewPost(input)

            res.status(201).send(createNewPost)
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
            const input = { id: req.params.id, newContent: req.body.newContent }
            const postsBusiness = new PostsBusiness()
            const editPost = await postsBusiness.editPost(input)

            res.status(200).send(editPost)
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
            const postsBusiness = new PostsBusiness()
            const deletePost = postsBusiness.deletePost(id)

            res.status(200).send(deletePost)
        }

        catch (error) {
            console.log(error)

            if (res.statusCode === 200) { res.status(500) }

            if (error instanceof Error) { res.send(error.message) }

            else { res.send("Unexpected error occured.") }
        }
    }
}