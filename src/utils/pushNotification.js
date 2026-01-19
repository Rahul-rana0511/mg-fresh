
const orderBooked = (name) => {
    return {
      type: 1,
      title: `Order Placed`,
      desc: `Hi ${name}, your order has been placed`,
    };
  };
  const orderShipped = (name) => {
    return {
      type: 2,
      title: `Order Shipped`,
      desc: `Hi ${name} your order has been shipped `,
    };
  };
  const orderOutOfDelivery = (name) => {
    return {
      type: 3,
      title: `Order Out Of Delivery`,
      desc: `Hi ${name}, your order has been Out of Delivery`,
    };
  };
  const orderDelivered = (name) => {
    return {
       type: 4,
      title: `Order Delivered`,
      desc: `Hi ${name}, your order has been deliverd`,
    };
  };
    const reminder = (name) => {
    return {
       type: 5,
      title: `We miss you 🛒`,
      desc: `Hi ${name}, You haven’t ordered in a while. Buy again now!`,
    };
  };
export  {
  orderBooked,
    orderShipped,
    orderOutOfDelivery,
    orderDelivered,
reminder
}
 