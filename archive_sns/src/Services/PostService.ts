import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { getConnection } from "typeorm";

import { Post } from '../Models/Entities/Post';
import { PostRepo } from '../Models/Repositories/PostRepo';
import { PostDTO } from '../Models/DTOs/PostDTO';

import { Account } from '../Models/Entities/Account';
import { AccountRepo } from '../Models/Repositories/AccountRepo';

import { PostImage } from '../Models/Entities/Image';
import { PostImageRepo } from '../Models/Repositories/ImageRepo';
import { ImageDTO } from '../Models/DTOs/ImageDTO';

@Service()
export class PostService {
	
	constructor(
		@InjectRepository() private post_repo: PostRepo,
		@InjectRepository() private post_img_repo: PostImageRepo
	) {}
	
	/**
	 * Create Post Service
	 * 
	 * @param writer_pk : Writer's PK 
	 * @param post_dto : Create Post DTO
	 * @param img_dto : Image DTO List -> if not upload image : null
	 */
	public async CreatePost(
		writer_pk: string,
		post_dto : PostDTO,
		img_dto  : ImageDTO[]
	): Promise<Post> 
	{
		const post_ent = post_dto.toEntity();
		post_ent.writer_pk = writer_pk;

		const result = await this.post_repo.save(post_ent);

		img_dto.map( async elem => {
			const new_img = elem.toEntity() as PostImage;
			new_img.uploader_pk = writer_pk;
			new_img.post = result;

			await this.post_img_repo.save(new_img);
		});

		return result;
	}

	/**
	 * Get just one of post information
	 * 
	 * @param post_pk : Post PK
	 */
	public async GetSinglePost( 
		post_pk: string 
		): Promise<Post> 
	{
		return await this.post_repo.GetSinglePost(post_pk);
	}

	/**
	 * Get list of short post information
	 * 
	 * @param offset 
	 * @param limit 
	 * @param order_by 
	 */
	public async GetPostList(
		offset 	: number,
		limit 	: number,
		order_by: number
	): Promise<Post[]> 
	{
		return await this.post_repo.GetPost(offset, limit, order_by);
	}

	public async GetOwnPost( 
		writer_pk: string,
		offset	 : number,
		limit	 : number,
	): Promise<Post[]>
	{
		return await this.post_repo.GetOwnPost(writer_pk, offset, limit);
	}

	/**
	 * Update Post Service
	 * 
	 * @param writer_pk : Writer's PK
	 * @param post_pk : Post's PK
	 * @param post_dto : Update Post DTO
	 * @param new_img_dto : Image DTO List which insert into post // or null
	 * @param del_img_list : Image PK List which delete from post // or null
	 */
	public async UpdatePost(
		writer_pk: string,
		post_pk: string,
		post_dto: PostDTO | null,
		new_img_dto: ImageDTO[] | null,
		del_img_list: string[] | null,
	): Promise<Post | null> {

		const target = {
			entity: await this.post_repo.findOne({ where: {pk: post_pk} })
		}

		if(target.entity?.writer_pk === writer_pk ) {

			post_dto?.updateEntity(target);
			await this.post_repo.save(target.entity);
			
			// del_img_list?.forEach( async elem => {
			// 	await this.post_image_repo.delete({ pk: elem });
			// });

			// new_img_dto?.forEach( async elem => {
			// 	const img_ent = elem.toEntity() as PostImage;
			// 	img_ent.post = target.entity;

			// 	await this.post_image_repo.save(img_ent);
			// });

			return target.entity;
		}

		return null;
	}

	/**
	 * Delete Post Service
	 * 
	 * @param writer_pk : Writer's PK
	 * @param post_pk : The Post's PK which want delete
	 */
	public async DeletePost(
		writer_pk: string,
		post_pk: string
	): Promise<boolean>
	{
		const target = await this.post_repo.findOne({ where: {pk: post_pk} });

		if( target.writer_pk === writer_pk ) {
			await this.post_repo.delete({ pk: target.pk });
			return true;
		}

		return false;
	}

}