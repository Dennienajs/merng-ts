import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { isAuth } from "./middleware/isAuth";
import { logger } from "./middleware/logger";

@Resolver()
export class RegisterResolver {
  @UseMiddleware(isAuth, logger)
  @Query(() => String)
  async hello() {
    return "Hello World!";
  }

  // REGISTER NEW USER MUTATION
  @Mutation(() => User)
  async register(
    @Arg("data") { email, firstName, lastName, password }: RegisterInput
  ): Promise<User> {
    // We want to return the user (now we cant return anything else but the User type)

    // encrypting the password so it's not plain text in the db
    const hashedPassword = await bcrypt.hash(password, 12);

    // creating user from our input about
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).save(); // .save to save to the db

    return user; // returning our response
  }
}
