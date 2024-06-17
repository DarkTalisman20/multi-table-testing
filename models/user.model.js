const mongoose = require('mongoose');

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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization', // Assuming you have an Organization model
            required: true,
        },
        roles: {
            type: [String], // Array of strings to store multiple roles
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
