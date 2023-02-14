import { BadRequestError } from "../errors/BadRequestError";
import { Post } from "../models/Post";
import { postDB } from "../types";


export interface GetPostsOutput {
    message: string,
    postsFound: Post[]
}

export interface CreateNewPostInput {
    id: string,
    creator_id: string,
    content: string
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

    public createNewPostInput(id: unknown, creator_id: unknown, content: unknown) {

        if (typeof id !== "string") {
            throw new BadRequestError("New post's 'id' must be string type.")
        }

        if (typeof creator_id !== "string") {
            throw new BadRequestError("New post's 'creator_id' must be string type.")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("New post's 'content' must be string type.")
        }

        const dto: CreateNewPostInput = {
            id, creator_id, content
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