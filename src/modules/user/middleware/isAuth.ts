import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../../../types/MyContext";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.session!.userId) {
    throw new Error("User not authenticated");
  }

  return next(); // Remeber to return next() to call the next middleware/next resolver
};
