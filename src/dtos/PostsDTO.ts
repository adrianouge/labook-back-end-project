import { BadRequestError } from "../errors/BadRequestError";
import { Post } from "../models/Post";
import { likedOrDislikedPostDB, postDB, userDB } from "../types";


export interface GetPostsOutput {
    message: string,
    postsFound: Post[]
}


export interface CreateNewPostInput {
    content: string,
    token: string
}

export interface CreateNewPostOutput {
    message: string,
    createdPost: {
        id: string,
        creator_id: string,
        content: string
    }
}


export interface EditPostInput {
    postToBeEditedID: string,
    newContent: string
}

export interface EditPostOutput {
    message: string,
    editedPost: {
        id: string,
        creator_id: string,
        content: string
    }
}


export interface LikeOrDislikePostInput {
    postId: string,
    userToken: string
}

export interface LikePostOutput {
    message: string,
    postLiked: postDB
}

export interface DislikePostOutput {
    message: string,
    postDisliked: postDB
}

export interface DeletePostInput {
    id: string
}

export interface DeletePostOutput {
    message: string,
    deletedPost: {
        id: string,
        creator_id: string,
        content: string
    }
}



export class PostsDTO {

    public getPostsOutput(postsFound: Post[]) {
        const dto: GetPostsOutput = {
            message: "Here are the posts founds:",
            postsFound
        }

        return dto
    }


    public createNewPostInput(content: unknown, token: unknown) {

        if (typeof token !== "string") {
            throw new BadRequestError("'Token'must be string type.")
        }
        if (typeof content !== "string") {
            throw new BadRequestError("New post's 'content' must be string type.")
        }

        const dto: CreateNewPostInput = {
            content, token
        }
        return dto
    }

    public createNewPostOutput(createdPost: postDB) {
        const dto: CreateNewPostOutput = {
            message: "Posted successfully.",
            createdPost
        }
        return dto
    }


    public editPostInput(postToBeEditedID: unknown, newContent: unknown) {

        if (typeof postToBeEditedID !== "string" || typeof newContent !== "string") {
            throw new BadRequestError("Post's 'id' and 'newContent' must be string type.")
        }

        const dto: EditPostInput = {
            postToBeEditedID,
            newContent
        }
        return dto
    }

    public editPostOutput(editedPost: Post) {
        const dto: EditPostOutput = {
            message: "Post edited successfully.",
            editedPost
        }
        return dto
    }


    public likeOrDislikePostInput(postToLikeOrDislikeID: unknown, userToken: unknown): LikeOrDislikePostInput {

        if (typeof postToLikeOrDislikeID !== "string") {
            throw new BadRequestError("Post's 'id' must be string type.")
        }

        if (typeof userToken !== "string") {
            throw new BadRequestError("User's token must be string type.")
        }

        const dto: LikeOrDislikePostInput = {
            postId: postToLikeOrDislikeID,
            userToken: userToken
        }
        return dto
    }

    public likePostOutput(likedPost: postDB, userThatLiked: string): LikePostOutput {
        const dto:LikePostOutput = {
            message: `${userThatLiked} liked post successfully.`,
            postLiked: likedPost
        }

        return dto
    }

    public dislikePostOutput(dislikedPost: postDB, userThatDisliked: string): DislikePostOutput {
        const dto:DislikePostOutput = {
            message: `${userThatDisliked} disliked post successfully.`,
            postDisliked: dislikedPost
        }

        return dto
    }


    public deletePostInput(id: unknown) {
        if (typeof id !== "string") {
            throw new BadRequestError("'id' to delete post must be string type.")
        }

        const dto: DeletePostInput = { id }
        return dto
    }

    public deletePostOutput(deletedPost: postDB) {
        const dto: DeletePostOutput = {
            message: "Post deleted successfully.",
            deletedPost
        }
        return dto
    }
}