import { Schema, model } from "mongoose";

const contact = new Schema(
  {
    name: {
      type: String,
      match: [/^[A-Za-z\s]+$/, "The 'name' field must only contain letters"],
      minlength: 3,
      maxlength: 30,
      trim: true,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      match: [
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
        "Enter a valid e-mail address",
      ],
      trim: true,
      required: [true, "E-mail is required"],
    },
    phone: {
      type: String,
      match: [/^\d+$/, "The 'phone' field must only contain numbers"],
      minlength: 3,
      maxlength: 16,
      trim: true,
      required: [true, "Phone is required"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const Contact = model("Contact", contact);

export default Contact;
