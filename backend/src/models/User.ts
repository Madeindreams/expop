import {prop, getModelForClass, Ref} from '@typegoose/typegoose';
import { Community } from './Community';

class ExperiencePoint {
	@prop({ required: true })
	public points!: number;

	@prop({ required: true })
	public timestamp!: Date;
}

class User {
	@prop({ required: true })
	public email?: string;

	@prop({ required: true, select: false })
	public passwordHash?: string;

	@prop()
	public profilePicture?: string;

	@prop({ type: () => [ExperiencePoint], default: [] })
	public experiencePoints?: ExperiencePoint[];

	@prop({ ref: () => Community, default: null })
	public community?: Ref<Community>;
}

export const UserModel = getModelForClass(User);
export { User };
