import express from "express";
import contactsController from "../controllers/contacts.js";

const router = express.Router();

router.get("/", contactsController.get);

router.get("/:id", contactsController.getById);

router.post("/", contactsController.create);

router.delete("/:id", contactsController.remove);

router.put("/:id", contactsController.update);

router.patch("/:id/favorite", contactsController.updateFavoriteStatus);

export default router;
