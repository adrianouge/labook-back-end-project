import { PostsDatabase } from "../database/PostsDatabase"
import { Post } from "../models/Post"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { CreateNewPostInput, DeletePostInput, EditPostInput, PostsDTO } from "../dtos/PostsDTO"
import { postDB } from "../types"

export class PostsBusiness {

    constructor(
        private postsDatabase: PostsDatabase,
        private postsDTO: PostsDTO
    ) { }

    public getPosts = async (q: string | undefined) => {
        const posts = await this.postsDatabase.getPosts(q)

        if (!posts) {
            throw new NotFoundError(`There are no posts with content including '${q}'.`)
        }

        const mappedPosts: Post[] = posts.map((post) => new Post(
            post.id,
            post.creator_id,
            post.content,
            post.created_at,
            post.updated_at
        ))

        const output = this.postsDTO.getPostsOutput(mappedPosts)
        return output
    }

    public createNewPost = async (checkedTypesPostTBC: CreateNewPostInput) => {
        let { id, creator_id, content } = checkedTypesPostTBC

        const [checkId] = await this.postsDatabase.getPost(id)

        if (checkId) {
            throw new BadRequestError("There's already a post with this 'id'.")
        }

        const date: string = new Date().toISOString()
        const newPost: postDB = {
            id,
            creator_id,
            content,
            created_at: date,
            updated_at: date
        }

        await this.postsDatabase.createPost(newPost)

        const createdPost = newPost
        const output = this.postsDTO.createNewPostOutput(createdPost)
        return output
    }

    public editPost = async (checkedInfoToEdit: EditPostInput) => {

        const { postToBeEditedID, newContent } = checkedInfoToEdit

        const [foundPostToEdit] = await this.postsDatabase.getPost(postToBeEditedID)

        if (!foundPostToEdit) {
            throw new NotFoundError("There are no posts with inserted 'id'.")
        }

        let editedPost = new Post(
            foundPostToEdit.id,
            foundPostToEdit.creator_id,
            foundPostToEdit.content,
            foundPostToEdit.created_at,
            foundPostToEdit.updated_at
        )
        editedPost.setContent(newContent)
        editedPost.setUpdatedAt(new Date().toISOString())
        await this.postsDatabase.editPost(editedPost)

        const output = this.postsDTO.editPostOutput(editedPost)
        return output
    }

    public deletePost = async (checkedTypeId: DeletePostInput) => {
        const { id } = checkedTypeId
        const [postToDelete] = await this.postsDatabase.getPost(id)

        if (!postToDelete) {
            throw new Error("There are no posts with inserted 'id'.")
        }

        await this.postsDatabase.deletePost(id)
        const postDeleted: postDB = postToDelete

        const output = this.postsDTO.deletePostOutput(postDeleted)
        return output
    }
}