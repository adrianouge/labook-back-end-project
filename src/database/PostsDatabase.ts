import { BaseDatabase } from "./BaseDatabase";
import { Post } from "../models/Post";
import { postDB } from "../types";

export class PostsDatabase extends BaseDatabase {
    
    public static TABLE_POSTS = "posts"
    public static TABLE_USERS = "users"

    dbConnection = BaseDatabase.connection

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
                ).where({content: `%${q}%`})
            return allPostsWithContentLike
        }
    }

    public async createPost(newPost: postDB) {
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