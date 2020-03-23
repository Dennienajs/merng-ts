import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
// eslint-disable-next-line no-unused-vars
import { MyContext } from "../../../src/types/MyContext";

@Resolver()
export class LoginResolver {
  // LOGIN USER MUTATION
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    // Looks for user email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return null;
    }

    // Here - we found a user & the password was correct. Good to go.
    // Send back a cookie
    ctx.req.session!.userId = user.id; // Asuming it is defined, since we added it in the middleware

    return user; // returning our response
  }
}
