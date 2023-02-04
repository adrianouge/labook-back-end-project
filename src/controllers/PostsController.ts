import { Request, Response } from "express";
import { PostsDatabase } from "../database/PostsDatabase";
import { Post } from "../models/Post";

export class PostsController {
// +: to implement 

//  + validate query
    public getAllPosts = async (req: Request, res: Response) => {
        try {
            let postDatabase = new PostsDatabase()
            let allPosts: Post[] = await postDatabase.getAllPosts()

            let mappedPosts = allPosts.map((post) => new Post(
                post.id,
                post.creator_id,
                post.content
            ))

            res.status(200).send(mappedPosts)
        }

        catch (error) {
            console.log(error)

            if (res.statusCode === 200) { res.status(500) }

            if (error instanceof Error) { res.send(error.message) }

            else { res.send("Unexpected error ocured.") }
        }
    }

//  + validate body 
    public createNewPost = async (req: Request, res: Response) => {

        try {
            const { id, creator_id, content } = req.body

            const postsDatabase = new PostsDatabase()
            const [checkId] = await postsDatabase.getPost(id)
            console.log(checkId)
            if (!checkId) {
                const newPost = new Post(
                    id,
                    creator_id,
                    content
                )
                postsDatabase.createPost(newPost)
                res.status(200).send("Posted successfully.")
            }
            else {
                res.status(400)
                throw new Error("There's already a post with this 'id'.")
            }
        }

        catch (error) {
            console.log(error)

            if (res.statusCode === 200) { res.status(500) }

            if (error instanceof Error) { res.send(error.message) }

            else { res.send("Unexpected error occured.") }
        }
    }

// + validate new content
    public editPost = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const { newContent } = req.body

            const postDatabase = new PostsDatabase()
            const [postToEdit] = await postDatabase.getPost(id)

            if (postToEdit) {
                let editedPost = new Post(
                    postToEdit.id,
                    postToEdit.creator_id,
                    newContent
                )
                postDatabase.editPost(editedPost)
                res.status(200).send("Post edited successfully.")
            }

            else {
                res.status(400)
                throw new Error("There are no posts with inserted 'id'.")
            }
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
            const postDatabase = new PostsDatabase()

            const postToDelete = await postDatabase.getPost(id)
            if (postToDelete) {
                await postDatabase.deletePost(id)
            }
            else {
                res.status(400)
                throw new Error("There are no posts with inserted 'id'.")
            }
        }
        catch (error) {
            console.log(error)

            if (res.statusCode === 200) { res.status(500) }

            if (error instanceof Error) { res.send(error.message) }

            else { res.send("Unexpected error occured.") }
        }
    }
}