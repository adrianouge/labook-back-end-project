export interface postDB {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string
}

export interface userDB {
    id: string,
    name: string,
    email: string,
    password: string,
    role: string,
    created_at: string
}

export interface likedOrDislikedPostDB {
    user_id: string,
    post_id: string,
    like: number
}