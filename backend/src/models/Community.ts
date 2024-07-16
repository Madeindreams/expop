import { prop, getModelForClass } from '@typegoose/typegoose';

class Community {
	@prop({ required: true, unique: true, index: true, maxlength: 50})
	public name?: string;

	@prop()
	public logo?: string;
}

export const CommunityModel = getModelForClass(Community);
export { Community };
