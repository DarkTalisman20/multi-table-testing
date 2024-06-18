import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        organizationID: {
            type: String,
            required: true,
        },
        roles: {
            type: [String], 
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", UserSchema);

export default User;