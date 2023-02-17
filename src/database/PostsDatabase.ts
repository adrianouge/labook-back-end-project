import { BaseDatabase } from "./BaseDatabase";
import { Post } from "../models/Post";
import { likedOrDislikedPostDB, postDB, userDB } from "../types";

export class PostsDatabase extends BaseDatabase {

    public static TABLE_POSTS = "posts"
    public static TABLE_USERS = "users"
    public static TABLE_LIKE_DISLIKES = "likes_dislikes"

    dbConnection = BaseDatabase.connection


    public async createPost(newPost: postDB) {
        await this.dbConnection.insert(newPost).into(PostsDatabase.TABLE_POSTS)
    }


    public async getPostToCheckLike(postId: string, userId: string) {
        const postToCheckLike = await this.dbConnection(PostsDatabase.TABLE_LIKE_DISLIKES).where({ user_id: userId, post_id: postId })
        return postToCheckLike
    }

    public async createLikePost(likePost: likedOrDislikedPostDB, postLikedUpdated: postDB) {
        await this.dbConnection(PostsDatabase.TABLE_LIKE_DISLIKES).insert(likePost)
        await this.dbConnection(PostsDatabase.TABLE_POSTS).update(postLikedUpdated).where({ id: postLikedUpdated.id})
    }

    public async likePost(likePost: likedOrDislikedPostDB, postLikedUpdated: postDB) {
        await this.dbConnection(PostsDatabase.TABLE_LIKE_DISLIKES).update(likePost).where({user_id: likePost.user_id, post_id: likePost.post_id})
        await this.dbConnection(PostsDatabase.TABLE_POSTS).update(postLikedUpdated).where({ id: postLikedUpdated.id })
    }

    public async dislikePost(dislikedPost: likedOrDislikedPostDB, postDislikedUpdated: postDB) {
        await this.dbConnection(PostsDatabase.TABLE_LIKE_DISLIKES).update(dislikedPost).where({ user_id: dislikedPost.user_id, post_id: dislikedPost.post_id })
        await this.dbConnection(PostsDatabase.TABLE_POSTS).update(postDislikedUpdated).where({ id: postDislikedUpdated.id })
    }

    public async getPosts(q: string | undefined) {
        if (!q) {
            let foundPosts: Post[] = await this.dbConnection(PostsDatabase.TABLE_POSTS)
                .leftOuterJoin(PostsDatabase.TABLE_USERS,
                    "posts.creator_id", "=", "users.id"
                )
            return foundPosts
        }

        else {
            let allPostsWithContentLike: Post[] = await this.dbConnection(PostsDatabase.TABLE_POSTS)
                .leftJoin(PostsDatabase.TABLE_USERS,
                    "creator_id", "=", "users.id"
                ).where({ content: `%${q}%` })
            return allPostsWithContentLike
        }
    }

    public async getPost(id: string) {
        let foundPost = await this.dbConnection(PostsDatabase.TABLE_POSTS).where({ id })
        return foundPost
    }


    public async editPost(editedPost: Post) {
        await this.dbConnection(PostsDatabase.TABLE_POSTS)
            .update(editedPost)
            .where({ id: editedPost.id })
    }


    public async deletePost(id: string) {
        await this.dbConnection(PostsDatabase.TABLE_POSTS)
            .del()
            .where({ id })
    }


}