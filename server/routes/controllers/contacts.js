import service from "../../services/contacts.js";
import schema from "../../utils/validation.js";

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
  const { id } = req.params;

  try {
    const contact = await service.getContactById(id);

    contact
      ? res.json({
          status: 200,
          statusText: "OK",
          data: {
            contact,
          },
        })
      : res.status(404).json({
          status: 404,
          statusText: "Not Found",
          message: `Not found contact by id: ${id}`,
        });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const create = async (req, res) => {
  try {
    const body = await schema.validateAsync(req.body);
    const contact = await service.createContact(body);

    res.status(201).json({
      status: 201,
      statusText: "Created",
      data: {
        contact,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      statusText: "Bad Request",
      message: err.details[0].message,
    });
  }
};

const remove = async (req, res, next) => {
  const { id } = req.params;

  try {
    const contact = await service.removeContact(id);

    contact
      ? res.json({
          status: 200,
          statusText: "OK",
          data: {
            contact,
          },
        })
      : res.status(404).json({
          status: 404,
          statusText: "Not Found",
          message: `Not found contact by id: ${id}`,
        });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
};

const update = async (req, res) => {
  const { id } = req.params;

  try {
    const body = await schema.validateAsync(req.body);
    const contact = await service.updateContact(id, body);

    contact
      ? res.json({
          status: 200,
          statusText: "OK",
          data: {
            contact,
          },
        })
      : res.status(404).json({
          status: 404,
          statusText: "Not Found",
          message: `Not found contact by id: ${id}`,
        });
  } catch (err) {
    res.status(400).json({
      status: 400,
      statusText: "Bad Request",
      message: err.details[0].message,
    });
  }
};

const updateFavoriteStatus = async (req, res, next) => {
  const { id } = req.params;
  const favorite = Object.hasOwn(req.body, "favorite")
    ? req.body.favorite
    : null;

  try {
    if (favorite) {
      const contact = await service.updateContact(id, { favorite });

      contact
        ? res.json({
            status: 200,
            statusText: "OK",
            data: {
              contact,
            },
          })
        : res.status(404).json({
            status: 404,
            statusText: "Not Found",
            message: `Not found contact by id: ${id}`,
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

const ctrlContacts = {
  get,
  getById,
  create,
  remove,
  update,
  updateFavoriteStatus,
};

export default ctrlContacts;
