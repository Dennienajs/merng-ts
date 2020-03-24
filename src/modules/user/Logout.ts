import { Resolver, Mutation, Ctx } from "type-graphql";
import { MyContext } from "../../../src/types/MyContext";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext): Promise<Boolean> {
    // we pass a function to the promise
    return new Promise((resolve, reject) =>
      ctx.req.session?.destroy((error: Error) => {
        // gets rid of the users logged in session
        if (error) {
          console.log(error);
          return reject(false);
        }

        // removes cookie and resolves promise
        ctx.res.clearCookie("qid");
        return resolve(true);
      })
    );
  }
}
