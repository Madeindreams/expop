import {DocumentType} from '@typegoose/typegoose';
import {Community, CommunityModel} from '../models/Community';
import {UserModel} from '../models/User';
import ValidationUtils from './UtilityClass';
import { PipelineStage } from 'mongoose';

class CommunityClass {
    private community?: DocumentType<Community>;

    /**
     * @param {Partial<Community>} data - The data to be passed to the constructor
     * @param {string | null} id - The ID of the community to load.
     */
    constructor(data: Partial<Community> = {}, id: string | null = null) {
        if (!id) {
            this.community = new CommunityModel({
                ...data,
            });
        }
    }

    /**
     * Sets the value of a field in the community object.
     *
     * @param {keyof Community} fieldName - The name of the field in the community object.
     * @param {unknown} value - The value to set for the field.
     */
    setField(fieldName: keyof Community, value: unknown): void {
        if (this.community) {
            (this.community[fieldName] as unknown) = value;
        } else {
            throw new Error('Community is not initialized.');
        }
    }

    /**
     * Retrieves the community object.
     *
     * @return {DocumentType<Community>} The community object.
     */
    getObject(): DocumentType<Community> {
        if (!this.community) {
            throw new Error('Community is not initialized.');
        }
        return this.community;
    }

    /**
     * Saves the community.
     *
     * @return {Promise<void>} A promise that resolves when the community is saved successfully, or rejects with an error.
     */
    async save(): Promise<void> {
        if (!this.community) {
            throw new Error('Community is not initialized.');
        }
        await this.community.save();
    }

    /**
     * Populates the specified fields of the community.
     *
     * @param {string|string[]} fields - The fields to populate in the community.
     * @return {Promise<DocumentType<Community>>} - A promise that resolves with the populated community.
     */
    async populate(fields: string | string[]): Promise<DocumentType<Community>> {
        if (!this.community) {
            throw new Error('Community is not initialized.');
        }
        await this.community.populate(fields);
        return this.community;
    }

    /**
     * Loads a community by ID.
     *
     * @param {string} id - The ID of the community to load.
     * @return {Promise<void>} A promise that resolves when the document is loaded.
     */
    async loadById(id: string): Promise<void> {
        if (!ValidationUtils.validateMongoIDs([id])) {
                throw new Error('Invalid MongoDB ObjectID');
        }

        try {
            this.community = await CommunityModel.findById(id).orFail();
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
     * Ranks communities by the total amount of points of each user's total points within that community.
     * @return {Promise<Array<{ communityId: string, totalPoints: number }>>} - A promise that resolves to an array of communities and their total points.
     */
    static async rankCommunitiesByTotalPoints(): Promise<Array<{ communityId: string, totalPoints: number }>> {
        const pipeline: PipelineStage[] = [
            {
                $unwind: { path: "$experiencePoints" }
            },
            {
                $group: {
                    _id: "$_id",
                    totalExperience: { $sum: "$experiencePoints.points" },
                    community: { $first: "$community" }
                }
            },
            {
                $group: {
                    _id: "$community",
                    totalPoints: { $sum: "$totalExperience" },
                    userCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "communities",
                    localField: "_id",
                    foreignField: "_id",
                    as: "communityDetails"
                }
            },
            {
                $unwind: { path: "$communityDetails" }
            },
            {
                $project: {
                    communityId: "$communityDetails._id",
                    totalPoints: 1,
                    logo: "$communityDetails.logo",
                    name: "$communityDetails.name",
                    userCount: 1
                }
            },
            {
                $sort: {
                    totalPoints: -1
                }
            }
        ];

        return await UserModel.aggregate(pipeline).exec();
    }
}

export default CommunityClass;
