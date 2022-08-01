const mongoose = require("mongoose");
const conversationschema = mongoose.Schema(
    {
        creator: {
            id: mongoose.Types.ObjectId,
            name: String,
            avatar: String
        },
        participant:{
            id: mongoose.Types.ObjectId,
            name: String,
            avatar: String
        },
        last_updated:{
            type:Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const Conversation = mongoose.model("Conversation", conversationschema)

module.exports = Conversation;