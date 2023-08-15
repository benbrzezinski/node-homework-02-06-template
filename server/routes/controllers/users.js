import jwt from "jsonwebtoken";
import bCrypt from "bcryptjs";
import service from "../../services/users.js";

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const body = Object.hasOwn(req.body, "username") ? req.body : null;

    if (body) {
      const isUserExists = await service.getUserWithOrOperator([
        { username },
        { email },
      ]);

      if (isUserExists) {
        return res.status(409).json({
          status: 409,
          statusText: "Conflict",
          data: {
            message: `${
              isUserExists.username === username
                ? "Username"
                : isUserExists.email === email
                ? "E-mail"
                : null
            } is already in use`,
          },
        });
      }

      const user = await service.createUser(body);
      await user.validate();
      user.set(
        "password",
        await bCrypt.hash(password, await bCrypt.genSalt(6)),
        String
      );
      await user.save();

      res.status(201).json({
        status: 201,
        statusText: "Created",
        data: {
          user: {
            email: user.email,
            subscription: user.subscription,
          },
        },
      });
    } else {
      res.status(400).json({
        status: 400,
        statusText: "Bad Request",
        data: { message: "Missing field username" },
      });
    }
  } catch (err) {
    if (err.name !== "ValidationError") {
      console.error(err.message);
      return next(err);
    }

    const errors = Object.entries(err.errors).reduce(
      (acc, e) => ({ ...acc, [e.at(0)]: e.at(1).message }),
      {}
    );

    res.status(400).json({
      status: 400,
      statusText: "Bad Request",
      data: { message: errors },
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await service.getUser({ email });

    if (
      !existingUser ||
      !(await bCrypt.compare(password, existingUser.password))
    ) {
      return res.status(401).json({
        status: 401,
        statusText: "Unauthorized",
        data: { message: "Incorrect e-mail or password" },
      });
    }

    const payload = {
      id: existingUser._id,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    const user = await service.updateUser({ email }, { token });

    res.json({
      status: 200,
      statusText: "OK",
      data: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (err) {
    if (err.name !== "ValidationError") {
      console.error(err.message);
      return next(err);
    }

    const errors = Object.entries(err.errors).reduce(
      (acc, e) => ({ ...acc, [e.at(0)]: e.at(1).message }),
      {}
    );

    res.status(400).json({
      status: 400,
      statusText: "Bad Request",
      data: { message: errors },
    });
  }
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await service.updateUser({ _id }, { token: null });
    res.status(204).end();
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await service.getUser({ _id });

    res.json({
      status: 200,
      statusText: "OK",
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const setSubscription = async (req, res, next) => {
  try {
    const { email } = req.user;
    const subscription = Object.hasOwn(req.body, "subscription")
      ? req.body.subscription
      : null;

    if (subscription) {
      await service.updateUser({ email }, { subscription });

      res.json({
        status: 200,
        statusText: "OK",
        data: {
          user: {
            email,
            subscription,
          },
        },
      });
    } else {
      res.status(400).json({
        status: 400,
        statusText: "Bad Request",
        data: { message: "Missing field subscription" },
      });
    }
  } catch (err) {
    if (err.name !== "ValidationError") {
      console.error(err.message);
      return next(err);
    }

    const errors = Object.entries(err.errors).reduce(
      (acc, e) => ({ ...acc, [e.at(0)]: e.at(1).message }),
      {}
    );

    res.status(400).json({
      status: 400,
      statusText: "Bad Request",
      data: { message: errors },
    });
  }
};

const usersController = {
  register,
  login,
  logout,
  getCurrent,
  setSubscription,
};

export default usersController;
