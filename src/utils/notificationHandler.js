import "dotenv/config";
import * as Model from "../models/index.js";
import firebase from "firebase-admin";
import {orderBooked,
    orderShipped,
    orderOutOfDelivery,
    orderDelivered,
  reminder} from "./pushNotification.js";
import {serviceAccount} from "../../mg_fresh_firebase.js";
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

const buildDataPayload = (
  user,
  title,
  type,
  user_id,
  other_user,

  desc,
  redirectId,
  senderId
) => {
  const data = {};
  if (user?.first_name) data.user_name = String(user.first_name);

  if (user?.profile_image) data.user_image = String(user.profile_image);

  if (title) data.title = String(title);

  if (type) data.type = String(type);

  if (user_id) data.user_id = String(user_id);

  if (other_user) data.other_user = String(other_user);

  if (desc) data.body = String(desc);
  if (redirectId) data.redirectId = String(redirectId);
  if (senderId) data.senderId = String(senderId)

  return data;
};

const pushNotification = async ({
  user_id,
  type,
  message,
  other_user,
  misc,
}) => {
  try {
    const user = await Model.User.findById(other_user);
    const sendNotificationTo = await Model.User.findById(user_id);
    let title = "";
    let desc = "";

    switch (type) {
      case "orderBooked":
        ({ title, desc, type } = orderBooked(user?.first_name));
        break;
      case "orderShipped":
        ({ title, desc, type } = orderShipped(user?.first_name));
        break;
      case "orderDelivered":
        ({ title, desc, type } = orderDelivered(user?.first_name));
        break;
      case "orderOutOfDelivery":
        ({ title, desc, type } = orderOutOfDelivery(user?.first_name));
        break;
         case "reminder":
        ({ title, desc, type } = reminder(user?.first_name));
        break;
      default:
        break;
    }
    if (type != 5) {
      await Model.Notification.create({
        user_id,
        other_user,
        title,
        desc,
        user_image: user?.profile_image,
        notification_type: type,
        redirectId: misc?.redirectId,
      });
    }

    // if (sendNotificationTo?.is_enable_notification == 1) {
      const notification = {
        tokens: [sendNotificationTo?.device_token],
        priority: "high",
        contentAvailable: true,
        notification: {
          title: title,
          body: desc,
        },
        data: buildDataPayload(
          user,
          title,
          type,
          user_id,
          other_user,
          desc,
          misc?.redirectId,
          misc?.senderId
        ),
        android: {
          notification: {
            sound: "default",
          },
        },
        apns: {
          payload: {
            aps: {
              // contentAvailable: true,
              sound: "default",
              badge: 1,
              // mutableContent: true,
            },
          },
        },
      };

      try {
        // console.log(notification?.data,"data")
        const response = await firebase
          .messaging()
          .sendEachForMulticast(notification);
        console.log(response, "res");
        response.responses?.forEach((response) => {
          if (response.error) {
            console.log("error>>", response?.error?.errorInfo);
          } else {
            console.log("success", response);
          }
        });
      } catch (err) {
        console.log("Something went wrong!", err);
      }
    // }
  } catch (error) {
    console.error("Error in pushNotification:", error);
  }
};

export default pushNotification;