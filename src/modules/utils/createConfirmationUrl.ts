// import { v4 } from "uuid";

export const createConfirmationUrl = (userId: number) => {
  //   const token = v4();

  // await redis.set(token, userId, "ex", 60 * 60 * 24); // 1 day expiration
  console.log("In createConfirmationUrl - userId: ", userId);
  //   return `http://localhost:3000/user/confirm/${token}`;
  return `http://localhost:3000/user/confirm/${userId}`;
};
