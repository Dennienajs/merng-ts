import { Resolver, Query, Mutation, Arg } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
// eslint-disable-next-line no-unused-vars
import { RegisterInput } from "./register/RegisterInput";

@Resolver()
export class RegisterResolver {
  @Query(() => String)
  async helloWorld() {
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
