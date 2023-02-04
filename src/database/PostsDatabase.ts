import { BaseDatabase } from "./BaseDatabase";
import { Post } from "../models/Post";

export class PostsDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_USERS = "users"

    dbConnection = BaseDatabase.connection

    public async getAllPosts() {
        let allPosts: Post[] = await this.dbConnection(PostsDatabase.TABLE_POSTS)
            .leftJoin(PostsDatabase.TABLE_USERS,
                "creator_id", "=", "users.id"
            )
        return allPosts
    }

    public async createPost(newPost: Post) {
        await this.dbConnection.insert(newPost).into(PostsDatabase.TABLE_POSTS)
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