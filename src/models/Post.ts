
export class Post {

    constructor(
        public id: string,
        public creator_id: string,
        public content: string,
        public created_at: string,
        public updated_at: string
    ) {}
    
    
    public getContent() {
        return this.content
    }

    public setContent(newContent: string) {
        this.content = newContent
    }

    public getUpdatedAt() {
        return this.updated_at
    }

    public setUpdatedAt(newUpdated_at: string) {
        this.updated_at = newUpdated_at
    }


}