export const successResponse = (res, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data
  });
};

export const collectionResponse = (res, data = [], meta = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    meta
  });
};
