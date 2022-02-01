const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },

  chats: [
    {
      messagesWith: { type: Schema.Types.ObjectId, ref: "User" },
      messages: [
        {
          msg: { type: String, required: true },
          sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
          receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
          date: { type: Date }
        }
      ]
    }
  ]
});

module.exports = mongoose.model("Chat", ChatSchema);
