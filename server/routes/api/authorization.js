import passport from "passport";

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        status: 401,
        statusText: "Unauthorized",
        data: { message: "Not authorized" },
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export default auth;
