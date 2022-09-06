const mongoose = require("mongoose");

const DonationSchema = mongoose.Schema(
    {
        member_id: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        payment:
        {
            type: Number, min: 200, max: 30400, trim: true
        },

        paymenttype: {
            type: String,
            required: true,
            enum: ["Monthly", "Event", "Donation", "Other"],
            trim: true
        },
        paymentdone:
        {
            type: Date,
            //timezone: "Asia/Dhaka",
            //required: true
        },

        comments: {
            type: String,
            trim: true,
        }

    },
    {
        timestamps: true,
    }
);

const Donation = mongoose.model("Donation", DonationSchema);

module.exports = Donation;
