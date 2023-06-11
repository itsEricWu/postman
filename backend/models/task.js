const mongoose = require("mongoose");
// make schema for task
// title: 'task1',
// description: 'task1 description',
// location: {type: 'Point', coordinates: [100,100]},
// isTaken: false,
// senderInfo: '{}',
// receiverInfo: '{}',
// posterId: 'posterId1',
// takerId: 'takerId1',
// timeRemaining: 'timeRemaining1',
// status: 'status1',
// confirmCode: 'confirmCode1'
const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    isTaken: {
      type: Boolean,
      required: true,
    },
    senderInfo: {
      type: JSON,
      required: true,
    },
    receiverInfo: {
      type: JSON,
      required: true,
    },
    senderAddress: {
      type: String,
      required: true,
    },
    receiverAddress: {
      type: String,
      required: true,
    },
    posterId: {
      type: String,
      required: true,
    },
    takerId: {
      type: String,
      required: true,
    },
    timeRemaining: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    confirmCode: {
      type: String,
      required: true,
    },
    ImageUrl: {
      type: String,
      default: "None",
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
