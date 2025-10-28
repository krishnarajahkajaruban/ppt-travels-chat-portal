const { Schema, model } = require("mongoose");

const queryResponseSchema = new Schema(
  {
    query: {
      type: Array,
      required: [true, "Query must be provided"]
    },
    response: {
      type: String,
      required: [true, "Response must be provided"]
    },

  },
  { timestamps: true }
);

module.exports = model("QueryResponse", queryResponseSchema);
