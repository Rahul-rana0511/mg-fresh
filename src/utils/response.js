const successRes = (res, status, message, data, status_code) => {
    res.status(200).json({
      success: true,
      status: status_code ? status_code : status,
      message,
      data,
    });
  };
  
const errorRes = (res, status, message, data, status_code) => {
    res.status(status).json({
      success: false,
      status: status_code ? status_code : status,
      message,
      data,
    });
  };
  
  export { successRes, errorRes}
  
  