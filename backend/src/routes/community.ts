import express from "express";
import { CommunityModel } from "../models/Community";
import CommunityClass from "../classes/CommunityClass";
import { StatusCodes } from 'http-status-codes';

const communityRouter = express.Router();

/**
 * @route GET /community/leaderboard
 * @returns {Array} - Array of Community objects
 */
communityRouter.get("/leaderboard", async (_, res) => {
	try {
		const communities = await CommunityClass.rankCommunitiesByTotalPoints();
		res.status(StatusCodes.OK).send(communities);
	} catch (error) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({message: "Internal server error"});
	}
});

/**
 * @route GET /community/:id
 * @param {string} id - Community ID
 * @returns {Community} - Community object
 */
communityRouter.get("/:id", async (req, res) => {
	const community = await CommunityModel.findById(req.params.id).lean();
	if (!community) {
		return res.status(StatusCodes.NOT_FOUND).send({ message: "Community not found" });
	}
	res.status(StatusCodes.OK).send(community);
});



/**
 * @route GET /community
 * @returns {Array} - Array of Community objects
 */
communityRouter.get("/", async (_, res) => {
	const communities = await CommunityModel.find({}).lean();
	if (!communities) {
		return res.status(StatusCodes.NOT_FOUND).send({ message: "No communities not found" });
	}
	res.status(StatusCodes.OK).send(communities);
});


export {
    communityRouter
}
