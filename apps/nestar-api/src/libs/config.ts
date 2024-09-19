import { ObjectId } from "bson"

export const availableAgentSorts = ['createdAt', 'updateAt', 'memberLikes', 'memberViews', 'memberRank' ]
export const availableMemberSorts = ['createdAt', 'updateAt', 'memberLikes', 'memberViews' ]

export const availableOptions = ['propertyBarter', 'propertyRent'];
export const availablePropertySort = [
	'createdAt',
	'updatedAt',
	'propertyLikes',
	'propertyViews',
	'propertyRank',
	'propertyPrice',

];

export const availableBoardArticleSorts = ['createdAt', 'updatedAt', 'articleLikes', 'articleViews']
export const availableCommentSorts = ['createdAt', 'updatedAt']


// IMAGE CONFIGURATION (config.js)
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { pipeline } from "stream";
import { T } from "./types/common";

export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForImage = (filename: string) => {
	const ext = path.parse(filename).ext;
	return uuidv4() + ext;
};

export const shapeIntoMongoDBObjectId = (target:any) => {
    return typeof target === "string" ? new ObjectId(target) : target
}

export const lookupAuthMemberLiked = (memberId: T, targetRefId: string = '$_id') => {
	return {
		$lookup: {
			from: 'likes',
			let: {
				localLikeRefId: targetRefId,
				localMemberId: memberId,
				localMyFavorite: true
			},
			pipeline: [
				{
					$match: {
						$expr: {
							$and: [{ $eq: ['$likeRefId', '$$localLikeRefId']}, {$eq: ['$memberId', '$$localMemberId']}],
						},
					},
				},
				{
					$project: {
						_id: 0,
						memberId: 1,
						likeRefId: 1,
						myFavorite: '$$localMyFavorite'
					}
				}
			],
			as: 'meLiked',
		}
	}
}

interface lookupAuthMemberFollowed {
	followerId: T;
	followingId: string
}

export const lookupAuthMemberFollowed = (input: lookupAuthMemberFollowed) => {
	const{followerId, followingId} = input
	return {
		$lookup: {
			from: 'follows',
			let: {
				localFollowerId: followerId,
				localFollowingId: followingId,
				localMyFavorite: true
			},
			pipeline: [
				{
					$match: {
						$expr: {
							$and: [{ $eq: ['$followerId', '$$localFollowerId']}, {$eq: ['$followingId', '$$localFollowingId']}],
						},
					},
				},
				{
					$project: {
						_id: 0,
						followerId: 1,
						followingId: 1,
						myFollowing: '$$localMyFavorite'
					}
				}
			],
			as: 'meFollowed',
		}
	}
}

export const lookupMember = {
	$lookup: {
		from: 'members',
		localField: 'memberId',
		foreignField: '_id',
		as: 'memberData'
	}
}

export const lookupFollowingData = {
	$lookup: {
		from: 'members',
		localField: 'followingId',
		foreignField: '_id',
		as: 'followingData'
	}
}

export const lookupFollowersData = {
	$lookup: {
		from: 'members',
		localField: 'followerId',
		foreignField: '_id',
		as: 'followerData'
	}
}

export const lookupFavorite = {
	$lookup: {
		from: 'members',
		localField: 'favoriteProperty.memberId',
		foreignField: '_id',
		as: 'favoriteProperty.memberData'
	}
}

export const lookupVisit = {
	$lookup: {
		from: 'members',
		localField: 'visitedProperty.memberId',
		foreignField: '_id',
		as: 'visitedProperty.memberData'
	}
}