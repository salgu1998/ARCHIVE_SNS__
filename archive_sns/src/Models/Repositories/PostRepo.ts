import { EntityRepository, Repository } from "typeorm";
import { Post } from '../Entities/Post';

export const enum PostOrder {
	latest = "post.createAt",
}

const ShortInfoSelect = [
	"post.pk",
	"title",
	"writer",
];

@EntityRepository(Post)
export class PostRepo extends Repository<Post> { 
	
	/**
	 *  Get list that short post information
	 * 
	 * @param offset 
	 * @param limit 
	 * @param order_by
	 */
	public async GetPost( offset: number, limit: number, order_by: PostOrder ) {
		
		return this.createQueryBuilder("post")
			.select(ShortInfoSelect)
			.leftJoinAndSelect("post.writer", "writer")
			.orderBy(order_by, "DESC")
			.skip(offset)
			.take(limit)
			.getMany();
	}
	
	/**
	 *  Get list that short post information which written by user
	 * 
	 * @param offset 
	 * @param limit 
	 * @param order_by
	 */
	public async GetOwnPost( writer_pk: string, offset: number, limit: number ) {
		
		return this.createQueryBuilder("post")
			.select(ShortInfoSelect)
			.where("post.writer_pk = :writer_pk", { writer_pk })
			.orderBy("post.createdAt", "DESC")
			.skip(offset)
			.take(limit)
			.getMany();

	}

	/**
	 * Get all infomation of post which got same PK
	 * 
	 * @param post_pk : Post PK
	 */
	public async GetSinglePost(post_pk: string) {
		return this.createQueryBuilder("post")
			.leftJoinAndSelect("post.user", "user")
			.where("post.pk = :post_pk", {post_pk})
			.getOne();
	}

}