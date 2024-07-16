import express from "express";
import UserClass from "../classes/UserClass";
import CommunityClass from "../classes/CommunityClass";
import ValidationUtils from "../classes/UtilityClass";
import { StatusCodes } from 'http-status-codes';
const userRouter = express.Router();

/**
 * @route GET /user/:id
 * @param {string} id - User ID
 * @returns {User} - User object
 */
userRouter.get("/:id", async (req, res) => {
	const userId = req.params.id;
	if (!ValidationUtils.validateMongoIDs([userId])) {
		return res.status(StatusCodes.BAD_REQUEST).send({message: 'Invalid user ID'});
	}

	const User = new UserClass();
	try{
		await User.loadById(userId);
	}catch (error){
		return res.status(StatusCodes.NOT_FOUND).send({message: 'User not found'});
	}
	const user = User.getObject();

	return res.status(StatusCodes.OK).send(user);
});

/**
 * @route GET /user
 * @returns {Array} - Array of User objects
 */
userRouter.get("/", async (_, res) => {
	try{
		const users = await  UserClass.getAllUsersWithPoints();
		return res.status(StatusCodes.OK).send(users);
	}
	catch (error){
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({message: 'Internal server error'});
	}
});

/**
 * @route POST /user/:userId/join/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community
 */
userRouter.post("/:userId/join/:communityId", async (req, res) => {
	const { userId, communityId } = req.params;
	try {
		if (!ValidationUtils.validateMongoIDs([userId, communityId])) {
			return res.status(StatusCodes.BAD_REQUEST).send({message: 'Invalid user or community ID'});
		}
		const User = new UserClass();

		try{
			await User.loadById(userId);
		}catch (error){
			return res.status(StatusCodes.BAD_REQUEST).send({message: `User not found for id:${userId}`});
		}

		const user = User.getObject();
		if (!user) {
			return res.status(StatusCodes.BAD_REQUEST).send({message: `User not found for id:${userId}`});
		}
		if (user.community) {
			return res.status(StatusCodes.BAD_REQUEST).send({message: `User already in community`});
		}

		const Community = new CommunityClass();
		try{
			await Community.loadById(communityId);
		}catch (error){
			return res.status(StatusCodes.BAD_REQUEST).send({message: `Community not found for id:${communityId}`});
		}

		const community = Community.getObject();
		if (!community) {
			return res.status(StatusCodes.BAD_REQUEST).send({message: `Community not found for id:${communityId}`});
		}
		User.setField('community', community._id);
		await User.save();

		res.status(StatusCodes.OK).send({message: 'User joined community'});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({message: 'Internal server error'});
	}
});

/**
 * @route DELETE /user/:userId/leave
 * @param {string} userId - User ID
 */
userRouter.delete("/:userId/leave", async (req, res) => {
	const { userId } = req.params;
	try {
		if (!ValidationUtils.validateMongoIDs([userId])) {
			return res.status(StatusCodes.BAD_REQUEST).send({message: 'Invalid user ID'});
		}
		const User = new UserClass();
		try{
			await User.loadById(userId);
		}catch (error) {
			return res.status(StatusCodes.BAD_REQUEST).send({message: `User not found for id:${userId}`});
		}

		const user = User.getObject();
		if (!user) {
			return res.status(StatusCodes.BAD_REQUEST).send({message: `User not found for id:${userId}`});
		}
		if (!user.community) {
			return res.status(StatusCodes.BAD_REQUEST).send({message: `User not in community`});
		}
		User.setField('community', null);
		await User.save();

		res.status(StatusCodes.OK).send({message: 'User left community'});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({message: 'Internal server error'});
	}
});

export {
    userRouter
}
