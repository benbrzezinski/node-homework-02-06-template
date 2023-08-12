import service from "../../services/contacts.js";

const get = async (_, res, next) => {
  try {
    const contacts = await service.getContacts();

    res.json({
      status: 200,
      statusText: "OK",
      data: {
        contacts,
      },
    });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await service.getContactById(id);

    if (!contact) {
      return res.status(404).json({
        status: 404,
        statusText: "Not Found",
        message: `Not found contact by id: ${id}`,
      });
    }

    res.json({
      status: 200,
      statusText: "OK",
      data: {
        contact,
      },
    });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { body } = req;

    const contact = await service.createContact(body);

    res.status(201).json({
      status: 201,
      statusText: "Created",
      data: {
        contact,
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
      message: errors,
    });
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await service.removeContact(id);

    if (!contact) {
      return res.status(404).json({
        status: 404,
        statusText: "Not Found",
        message: `Not found contact by id: ${id}`,
      });
    }

    res.json({
      status: 200,
      statusText: "OK",
      data: {
        contact,
      },
    });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const contact = await service.updateContact(id, body);

    res.json({
      status: 200,
      statusText: "OK",
      data: {
        contact,
      },
    });
  } catch (err) {
    if (err.path === "_id") {
      return res.status(404).json({
        status: 404,
        statusText: "Not Found",
        message: `Not found contact by id: ${id}`,
      });
    }

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
      message: errors,
    });
  }
};

const updateFavoriteStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = Object.hasOwn(req.body, "favorite") ? req.body : null;

    if (body) {
      const contact = await service.updateContact(id, {
        favorite: body.favorite,
      });

      if (!contact) {
        return res.status(404).json({
          status: 404,
          statusText: "Not Found",
          message: `Not found contact by id: ${id}`,
        });
      }

      res.json({
        status: 200,
        statusText: "OK",
        data: {
          contact,
        },
      });
    } else {
      res.status(400).json({
        status: 400,
        statusText: "Bad Request",
        message: "Missing field favorite",
      });
    }
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const contactsController = {
  get,
  getById,
  create,
  remove,
  update,
  updateFavoriteStatus,
};

export default contactsController;
