const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        caption: { type: String },
        imageUrl: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        ],
        comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
        ],
    },
    { timestamps: true },
);

// get likes count
postSchema.virtual("likesCount").get(function () {
    return this.likes.length || 0;
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
