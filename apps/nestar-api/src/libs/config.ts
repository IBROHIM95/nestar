import { ObjectId } from "bson"


export const shapeIntoMongoDBObjectId = (target:any) => {
    return typeof target === "string" ? new ObjectId(target) : target
}