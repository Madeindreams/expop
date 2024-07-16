// src/classes/UserClass.ts
import {DocumentType} from '@typegoose/typegoose';
import {User, UserModel} from '../models/User';
import ValidationUtils from "./UtilityClass";

interface UserWithPoints {
    _id: string;
    email: string;
    profilePicture: string;
    totalExperience: number;
}

class UserClass {
    private user?: DocumentType<User>;

    /**
     * @param {Partial<User>} data - The data to be passed to the constructor
     * @param {string | null} id - The ID of the user to load.
     */
    constructor(data: Partial<User> = {}, id: string | null = null) {
        if (!id) {
            this.user = new UserModel({
                ...data,
            });
        }
    }

    /**
     * Sets the value of a field in the user object.
     *
     * @param {keyof User} fieldName - The name of the field in the user object.
     * @param {*} value - The value to set for the field.
     */
    setField(fieldName: keyof User, value: unknown) {
        if (this.user) {
            (this.user[fieldName] as unknown) = value;
        } else {
            throw new Error('User is not initialized.');
        }
    }

    /**
     * Retrieves the user object.
     *
     * @return {DocumentType<User> | undefined} The user object.
     */
    getObject(): DocumentType<User> | undefined {
        return this.user;
    }

    /**
     * Saves the user.
     *
     * @return {Promise<void>} A promise that resolves when the user is saved successfully, or rejects with an error.
     */
    async save(): Promise<void> {
        if (!this.user) {
            throw new Error('User is not initialized.');
        }
        await this.user.save();
    }


    /**
     * Populates the specified fields of the user.
     *
     * @param {string|string[]} fields - The fields to populate in the user.
     * @return {Promise<DocumentType<User>>} - A promise that resolves with the populated user.
     */
    async populate(fields: string | string[]): Promise<DocumentType<User>> {
        if (!this.user) {
            throw new Error('User is not initialized.');
        }
        await this.user.populate(fields);
        return this.user;
    }

    /**
     * Loads a user by ID.
     *
     * @param {string} id - The ID of the user to load.
     * @return {Promise<void>} A promise that resolves when the document is loaded.
     */
    async loadById(id: string): Promise<void> {
        if (!ValidationUtils.validateMongoIDs([id])) {
            throw new Error('Invalid MongoDB ObjectID');
        }

        try {
            this.user = await UserModel.findById(id).orFail();
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message.includes('No document found')) {
                    throw new Error('Community not found');
                }
            }
            throw error;
        }
    }

    /**
     * Retrieves all users with their total experience points.
     *
     * @returns {Promise<any[]>} - A promise that resolves to an array of users with their total experience points.
     */
    static async getAllUsersWithPoints(): Promise<UserWithPoints[]> {
        try {
            return await UserModel.aggregate([
                {
                    $unwind: "$experiencePoints"
                },
                {
                    $group: {
                        _id: "$_id",
                        email: { $first: "$email" },
                        profilePicture: { $first: "$profilePicture" },
                        community: { $first: "$community" },
                        totalExperience: { $sum: "$experiencePoints.points" }
                    }
                },
                {
                    $lookup: {
                        from: "communities",
                        let: { communityId: "$community" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$communityId"]
                                    }
                                }
                            }
                        ],
                        as: "communityDetails"
                    }
                },
                {
                    $addFields: {
                        communityDetails: {
                            $arrayElemAt: ["$communityDetails", 0]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        email: 1,
                        profilePicture: 1,
                        community: "$communityDetails",
                        totalExperience: 1
                    }
                }
            ]);
        } catch (error: unknown) {
            throw new Error(`Error retrieving users with points: ${error}`);
        }
    }
}

export default UserClass;
