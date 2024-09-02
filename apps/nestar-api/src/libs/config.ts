import { ObjectId } from "bson"

export const availableAgentSorts = ['createdAt', 'updateAt', 'memberLikes', 'memberViews', 'memberRank' ]
export const availableMemberSorts = ['createdAt', 'updateAt', 'memberLikes', 'memberViews' ]

export const shapeIntoMongoDBObjectId = (target:any) => {
    return typeof target === "string" ? new ObjectId(target) : target
}