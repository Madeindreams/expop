import mongoose from 'mongoose';

class ValidationUtils {
    /**
     * Validates if the provided strings are valid MongoDB ObjectIDs.
     *
     * @param {string[]} ids - An array of MongoDB ObjectIDs to validate.
     * @returns {boolean} - Returns true if all IDs are valid, otherwise false.
     */
    static validateMongoIDs(ids: string[]): boolean {
        return ids.every(id => mongoose.Types.ObjectId.isValid(id));
    }
}

export default ValidationUtils;
