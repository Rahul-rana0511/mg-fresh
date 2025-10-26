
const orderBooked = (name, date, time) => {
    return {
      type: 1,
      title: `Order Placed`,
      desc: `Hi ${name}, your order has been placed`,
    };
  };
  const orderShipped = (name, date, time) => {
    return {
      type: 2,
      title: `Order Shipped`,
      desc: `Hi ${name} your order has been placed`,
    };
  };
  const orderOutOfDelivery = (name, date, time) => {
    return {
      type: 3,
      title: `Order Out Of Delivery`,
      desc: `Hi ${name}, your order has been Out of Delivery`,
    };
  };
  const orderDelivered = (name, date, time) => {
    return {
       type: 4,
      title: `Order Delivered`,
      desc: `Hi ${name}, your order has been deliverd`,
    };
  };
export  {
  orderBooked,
    orderShipped,
    orderOutOfDelivery,
    orderDelivered,

}
 