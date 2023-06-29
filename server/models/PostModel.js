const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },

    text: { type: String, required: true },

    location: { type: String },

    picUrl: { type: String },

    likes: [{ user: { type: Schema.Types.ObjectId, ref: "User" } }],

    comments: [
      {
        _id: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        date: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
