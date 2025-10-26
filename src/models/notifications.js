import { Schema, model } from "mongoose";
const NotificationSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    other_user: { type: Schema.Types.ObjectId, ref: "User" },
    title: String,
    desc: String,
    user_image: String,
    notification_type: Number,
    status: { type: Number, default: 1 },
    redirectId: {type: String, default: null}
  },
  { timestamps: true }
);

const Notification = model("Notification", NotificationSchema, "Notifications");
export default Notification;
