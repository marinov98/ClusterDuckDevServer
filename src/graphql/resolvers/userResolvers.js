import jwt from "jsonwebtoken";
import config from "./../../utils/config/config";
import {
  validateLogin,
  validateRegister
} from "./../../utils/validation/validate";
import { comparePasswords } from "./../../utils/validation/bcrypt";
import { ApolloError, AuthenticationError } from "apollo-server";

export default {
  Query: {
    login: async (parent, args, { models: { userModel } }) => {
      try {
        // validate input
        const { error } = validateLogin(args);

        if (error) throw new AuthenticationError(error.details[0].message, 404);

        // find user if input is valid
        const user = await userModel.findOne({ email: args.email });

        if (!user)
          throw new AuthenticationError("Password and email do not match", 409);

        const isMatch = await comparePasswords(args.password, user.password);

        if (!isMatch)
          throw new AuthenticationError("Password and email do not match", 409);

        // if passwords match, create payload and sign JWT token
        const payload = {
          id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          firstName: user.firstName,
          lastName: user.lastName,
          posts: user.posts
        };

        const accessToken = jwt.sign(payload, config.jwt_secret, {
          expiresIn: "15m" // 15 minutes
        });

        const refreshToken = jwt.sign(payload, config.refresh_secret);

        // update User's refresh token in db
        await userModel.findOneAndUpdate(
          { email: user.email },
          { refreshToken: refreshToken }
        );

        return {
          authenticated: true,
          token: accessToken,
          refreshToken: refreshToken
        };
      } catch (err) {
        throw new AuthenticationError(err);
      }
    },
    user: async (parent, { id }, { models: { userModel } }) => {
      try {
        return await userModel.findById(id);
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    userByEmail: async (parent, { email }, { models: { userModel } }) => {
      try {
        return await userModel.findOne({ email: email });
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    usersByStatus: async (parent, { isAdmin }, { models: { userModel } }) => {
      try {
        return await userModel.find({ isAdmin: isAdmin });
      } catch (err) {
        throw new ApolloError(err);
      }
    },
    userPosts: async (parent, { id }, { models: { userModel } }) => {
      try {
        const user = await userModel.findById(id).populate("posts");
        return user.posts;
      } catch (err) {
        throw new ApolloError(err);
      }
    }
  },
  Mutation: {
    registerUser: async (parent, args, { models: { userModel } }) => {
      try {
        // validate user input from registration form
        const { error } = validateRegister(args);

        if (error) throw new ApolloError(error.details[0].message, 404);

        // if validated, make sure email has not already been used
        const userWithSameEmail = await userModel.findOne({
          email: args.email
        });

        if (userWithSameEmail)
          throw new ApolloError("Email already exists!", 409);

        const userWithSameUsername = await userModel.findOne({
          username: args.username
        });

        if (userWithSameUsername)
          throw new ApolloError("Username already exists", 409);

        // check to see if user is admin or not
        const isAdmin = args.isAdmin ? true : false;

        // If email and username are unique, create new user
        const userToBeCreated = {
          username: args.username,
          password: args.password,
          email: args.email,
          isAdmin,
          firstName: args.firstName,
          lastName: args.lastName
        };

        // await hashPasswordAndSave(userToBeCreated);
        const user = await userModel.create(userToBeCreated);
        return user;
      } catch (err) {
        throw new ApolloError(err);
      }
    }
  }
};
