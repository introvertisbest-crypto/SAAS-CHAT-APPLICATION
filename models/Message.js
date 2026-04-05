import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ createdAt: -1 });

export default mongoose.models?.Message || mongoose.model('Message', MessageSchema);
