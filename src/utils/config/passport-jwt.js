import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "../../db/models";
import passport from "passport";
import config from "./config";

// show from what header to extract the jwt and what secret to use to decode it
const options = {
  jwtFromRequest: ExtractJwt.fromHeader("Authorization"),
  secretOrKey: config.jwt_secret
};

passport.use(
  new Strategy(options, async (payload, done) => {
    try {
      // find an existing user
      const user = await User.findOne({ email: payload.email });

      if (!user) done(null, false);
      else done(null, user);
    } catch (err) {
      done(err);
    }
  })
);
