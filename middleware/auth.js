// auth.js
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwtSecret = process.env.JWT_SECRET;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

passport.use(
  new JwtStrategy(jwtOptions, (payload, done) => {
    console.log("payload=", payload);
    const user = { id: payload.sub };
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  })
);

module.exports = passport;
