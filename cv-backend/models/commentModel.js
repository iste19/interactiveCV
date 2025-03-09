const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    sectionHeading: {
      type: String,
    },
    comment: {
      type: String,
      required: [true, "Please add a comment"],
    },
    extraInfo: {
      type: String,
    },

    position: {
      left: {
        type: String,
      },
      right: {
        type: String,
      },
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);
