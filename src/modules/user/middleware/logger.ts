import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../../../types/MyContext";

export const logger: MiddlewareFn<MyContext> = async ({ args }, next) => {
  console.log("args: ", args);

  return next(); // Remeber to return next() to call the next middleware/next resolver
};
