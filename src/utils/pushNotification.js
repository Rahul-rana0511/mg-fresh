
const newBooking = (name, date, time) => {
    return {
      type: 1,
      title: `New Booking Alert`,
      desc: `${name} has booked a slot on ${date}`,
    };
  };
  const cancelBooking = (name, date, time) => {
    return {
      type: 2,
      title: `Cancel Booking Alert`,
      desc: `${name} has cancelled your booking`,
    };
  };
  const completeBooking = (name, date, time) => {
    return {
      type: 3,
      title: `Complete Booking Alert`,
      desc: `${name} has completed your booking`,
    };
  };
  const vehicleAdded = (name, date, time) => {
    return {
       type: 4,
      title: `New vehicle alert`,
      desc: `${name} added a new vehcile to sell`,
    };
  };
  const newMessage = (name) => {
    return {
      type: 5,
      title: `${name}`,
      desc: `${name} sent you a new message`,
    };
  };
export  {
  newBooking,
    completeBooking,
    cancelBooking,
    vehicleAdded,
    newMessage
}
 