import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { ChatGroupRepo, PostGroupRepo } from '../Models/Repositories/GroupRepo';
import { AccountRepo } from '../Models/Repositories/AccountRepo';

import { ChatGroup, Group, PostGroup } from '../Models/Entities/Group';
import { Account } from '../Models/Entities/Account';

import { GroupDTO } from '../Models/DTOs/GroupDTO';

abstract class GroupService<
	RepoType extends (ChatGroupRepo | PostGroupRepo),
	EntType extends (ChatGroup | PostGroup)
> {

	protected group_repo;
	protected account_repo;

	protected n_min_early_member = 1;

	constructor(
		group_repo: RepoType,
		account_repo: AccountRepo,
	) {
		this.group_repo = group_repo;
		this.account_repo = account_repo;
	}

	public async CreateGroup(
		gropu_dto: GroupDTO,
		member_pk_list: string[],
	) : Promise<EntType> 
	{
		if(member_pk_list.length < this.n_min_early_member)
			return undefined;

		const participant: Account[] = 
			await this.account_repo.FindByPKs(member_pk_list);
		
		if(participant) {
			const new_group = gropu_dto.toEntity() as EntType;
			new_group.participant = participant;

			return await this.group_repo.save(new_group);
		}

		return undefined;
	}

	public async DeleteGroup(
		group_pk: string
	): Promise<boolean> 
	{
		const target = await this.group_repo.findOne({ 
			where: {pk: group_pk}
		});

		// @TODO : Check -> is it Admin ( if not returning false )
		
		await this.group_repo.delete(target);
		return true;

		// return false;
	}

	public async Invite(
		group_pk: string,
		member_pk_list: string[]
	) {
		if(member_pk_list.length < this.n_min_early_member)
			return undefined;
		
		const target_group = await this.group_repo.findOne({ 
			where: {pk: group_pk}
		});

		const participant: Account[] = 
			await this.account_repo.FindByPKs(member_pk_list);

		if(participant) {
			target_group.participant = participant;

			return await this.group_repo.save(target_group);
		}

		return undefined;
	}
}

export class ChatGroupService extends GroupService< ChatGroupRepo, ChatGroup > {

	constructor(
		@InjectRepository() group_repo : ChatGroupRepo,
		@InjectRepository() account_repo : AccountRepo
	) {
		super(group_repo, account_repo);
		this.n_min_early_member = 2;
	}

}

export class PostGroupService extends GroupService< PostGroupRepo, PostGroup > {

	constructor(
		@InjectRepository() group_repo : PostGroupRepo,
		@InjectRepository() account_repo : AccountRepo
	) {
		super(group_repo, account_repo);
	}

}