import { Schema, model } from "mongoose";

const contact = new Schema(
  {
    name: {
      type: String,
      match: [/^[A-Za-z\s]+$/, "The name field must only contain letters"],
      minLength: 3,
      maxLength: 30,
      trim: true,
      required: [true, "The name field is required"],
    },
    email: {
      type: String,
      match: [
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
        "Enter a valid e-mail address",
      ],
      trim: true,
    },
    phone: {
      type: String,
      match: [
        /^[0-9\s+\-()]+$/,
        "The phone field must only contain numbers, spaces, plus signs, hyphens and parentheses",
      ],
      minLength: 3,
      maxLength: 16,
      trim: true,
      required: [true, "The phone field is required"],
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
