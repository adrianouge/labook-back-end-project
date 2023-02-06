import { PostsDatabase } from "../database/PostsDatabase"
import { Post } from "../models/Post"

export class PostsBusiness {
     // +: to implement 

    //  + validate query
    public getPosts = async (q: string | undefined) => {

        const postDatabase = new PostsDatabase()
        const posts: Post[] = await postDatabase.getAllPosts(q)

        let mappedPosts = posts.map((post) => new Post(
            post.id,
            post.creator_id,
            post.content
        ))

        if (q !== undefined && posts === undefined) {
            throw new Error(`There are no posts with content including ${q}`)
        }
        return mappedPosts
    }

    // + validate body
    public createNewPost = async (input: any) => {
        let { id, creator_id, content } = input

        const postsDatabase = new PostsDatabase()

        const [checkId] = await postsDatabase.getPost(id)

        if (!checkId) {
            const newPost = new Post(
                id,
                creator_id,
                content
            )
            postsDatabase.createPost(newPost)
            return ({ message: "Post created successfully.", newPost })
        }
        else {
            throw new Error("There's already a post with this 'id'.")
        }
    }

    // + validate body
    public editPost = async (input: any) => {
        const { id, newContent } = input
        const postDatabase = new PostsDatabase()
        const [postToEdit] = await postDatabase.getPost(id)

        if (postToEdit) {
            let editedPost = new Post(
                postToEdit.id,
                postToEdit.creator_id,
                newContent
            )
            postDatabase.editPost(editedPost)
            return ({ message: `Post updated successfully.`, editedPost })
        }

        else {
            throw new Error("There are no posts with inserted 'id'.")
        }
    }

    // validate id
    public deletePost = async (id: string) => {

        const postDatabase = new PostsDatabase()
        const postToDelete = await postDatabase.getPost(id)
        if (postToDelete) {
            await postDatabase.deletePost(id)
            return ({ message: `Post deleted successfully.`, postToDelete })
        }
        else {
            throw new Error("There are no posts with inserted 'id'.")
        }
    }
}