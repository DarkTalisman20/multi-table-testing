import mongoose from 'mongoose';

const TechExpSchema = mongoose.Schema(
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
        EmployeeID: {
            //If the company has assigned any special number.
            type: String,
            required: true,
        },
        role:{
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const TechExp = mongoose.model("TechExp", TechExpSchema);

export default TechExp;