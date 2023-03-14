import { PostsDatabase } from "../database/PostsDatabase"
import { Post } from "../models/Post"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { CreateNewPostInput, DeletePostInput, EditPostInput, LikeOrDislikePostInput, PostsDTO } from "../dtos/PostsDTO"
import { likedOrDislikedPostDB, postDB } from "../types"
import { TokenManager } from "../services/TokenManager"
import { IdGenerator } from "../services/IdGenerator"
import { UnauthorizedError } from "../errors/UnauthorizedError"

export class PostsBusiness {

    constructor(
        private postsDatabase: PostsDatabase,
        private postsDTO: PostsDTO,
        private tokenManager: TokenManager,
        private idGenerator: IdGenerator
    ) { }

    public createNewPost = async (checkedTypesPostTBC: CreateNewPostInput) => {

        let { content, token } = checkedTypesPostTBC

        const payload = this.tokenManager.getPayload(token)
        if (!payload) {
            throw new BadRequestError("Invalid token.")
        }

        const [checkId] = await this.postsDatabase.getPost(payload.id)

        if (checkId) {
            throw new BadRequestError("There's already a post with this 'id'.")
        }
        const id = this.idGenerator.generate()

        const date: string = new Date().toISOString()
        const newPost: postDB = {
            id,
            creator_id: payload.id,
            content,
            likes: 0,
            dislikes: 0,
            created_at: date,
            updated_at: date
        }

        await this.postsDatabase.createPost(newPost)

        const createdPost = newPost
        const output = this.postsDTO.createNewPostOutput(createdPost)
        return output
    }

    public likeOrDislikePost = async (likeOrDislikePostInput: LikeOrDislikePostInput) => {

        const { postId, userToken } = likeOrDislikePostInput
        const [postToLikeOrDislike] = await this.postsDatabase.getPost(postId)
        const userLikingOrDisliking = this.tokenManager.getPayload(userToken)

        if (!postToLikeOrDislike) {
            throw new NotFoundError("Post not found with inserted 'id'.")
        }

        if (userLikingOrDisliking === null) {
            throw new BadRequestError("Invalid token.")
        }

        const [postToCheckLike] = await this.postsDatabase.getPostToCheckLike(postId, userLikingOrDisliking.id)
        console.log(postToCheckLike)
        if (!postToCheckLike) {

            const userId = userLikingOrDisliking.id
            const likedPost: likedOrDislikedPostDB = {
                user_id: userId,
                post_id: postId,
                like: 1
            }

            const postWithLikeUpdated: postDB = {
                id: postToLikeOrDislike.id,
                creator_id: postToLikeOrDislike.creator_id,
                content: postToLikeOrDislike.content,
                likes: postToLikeOrDislike.likes += 1,
                dislikes: postToLikeOrDislike.dislikes,
                created_at: postToLikeOrDislike.created_at,
                updated_at: postToLikeOrDislike.updated_at
            }

            await this.postsDatabase.createLikePost(likedPost, postWithLikeUpdated)
            const userThatLiked = userLikingOrDisliking.name
            const output = this.postsDTO.likePostOutput(postWithLikeUpdated, userThatLiked)
            return output
        }

        else {
            if (postToCheckLike.like === 1) {
                const userId = userLikingOrDisliking.id
                const dislikedPost: likedOrDislikedPostDB = {
                    user_id: userId,
                    post_id: postId,
                    like: 0
                }
                const postDislikedUpdated: postDB = {
                    id: postToLikeOrDislike.id,
                    creator_id: postToLikeOrDislike.creator_id,
                    content: postToLikeOrDislike.content,
                    likes: postToLikeOrDislike.likes -= 1,
                    dislikes: postToLikeOrDislike.dislikes,
                    created_at: postToLikeOrDislike.created_at,
                    updated_at: postToLikeOrDislike.updated_at
                }
                await this.postsDatabase.dislikePost(dislikedPost, postDislikedUpdated)
                const userThatDisliked = userLikingOrDisliking.name
                const output = this.postsDTO.dislikePostOutput(postDislikedUpdated, userThatDisliked)
                return output
            }

            if(postToCheckLike.like === 0) {
            const userId = userLikingOrDisliking.id
            const likedPost: likedOrDislikedPostDB = {
                user_id: userId,
                post_id: postId,
                like: 1
            }

            const postWithLikeUpdated: postDB = {
                id: postToLikeOrDislike.id,
                creator_id: postToLikeOrDislike.creator_id,
                content: postToLikeOrDislike.content,
                likes: postToLikeOrDislike.likes += 1,
                dislikes: postToLikeOrDislike.dislikes,
                created_at: postToLikeOrDislike.created_at,
                updated_at: postToLikeOrDislike.updated_at
            }

            await this.postsDatabase.likePost(likedPost, postWithLikeUpdated)
            const userThatLiked = userLikingOrDisliking.name
            const output = this.postsDTO.likePostOutput(postWithLikeUpdated, userThatLiked)
            return output
            }
        }
    }

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


    public editPost = async (checkedInfoToEdit: EditPostInput) => {

        const { token, postToBeEditedID, newContent } = checkedInfoToEdit

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new BadRequestError("Invalid token.")
        }

        const [foundPostToEdit] = await this.postsDatabase.getPost(postToBeEditedID)

        if (!foundPostToEdit) {
            throw new NotFoundError("There are no posts with inserted 'id'.")
        }

        if(payload.id !== foundPostToEdit.creator_id) {
            throw new UnauthorizedError("You must be the creator of the post to edit it.")
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

    public deletePost = async (deletePostInput: DeletePostInput) => {
        const { id, token } = deletePostInput
        const [postToDelete] = await this.postsDatabase.getPost(id)
        const userTryingToDelete = this.tokenManager.getPayload(token)

        if (!postToDelete) {
            throw new NotFoundError("There are no posts with inserted 'id'.")
        }


        if(userTryingToDelete === null) {
            throw new BadRequestError("Invalid token.")
        }

        if(userTryingToDelete.id !== postToDelete.creator_id) {
            throw new UnauthorizedError("You must be the creator of the post to delete it.")
        }
        await this.postsDatabase.deletePost(id)
        const postDeleted: postDB = postToDelete

        const output = this.postsDTO.deletePostOutput(postDeleted)
        return output
    }
}