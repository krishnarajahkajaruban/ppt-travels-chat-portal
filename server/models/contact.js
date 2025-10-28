const { Schema, model } = require("mongoose");

const contactSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phoneNo: {
            type: Number,
            required: true
        },
        message: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = model("contact", contactSchema);
