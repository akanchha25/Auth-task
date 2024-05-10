const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          // Regex pattern to match the email domain
          const excludedDomains = ["test.com"];
          const excludedDomainsRegex = new RegExp(
            `^(?!.*(${excludedDomains.join("|")}))`,
            "i"
          );
          const emailRegex = /^[a-zA-Z0-9._]+@([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}$/;
          return emailRegex.test(value) && excludedDomainsRegex.test(value);
        },
        message: "Email must be a valid email domain",
      },
    },

    password: {
      type: String,
      validate: {
        validator: function (value) {
          const errorMessages = [];

          // Minimum length of 6 characters
          if (value.length < 6) {
            errorMessages.push("Password must be at least 6 characters long");
          }

          // At least one capital letter
          if (!/[A-Z]/.test(value)) {
            errorMessages.push(
              "Password must contain at least one capital letter"
            );
          }

          // At least one special character
          if (!/[!@#$%^&*]/.test(value)) {
            errorMessages.push(
              "Password must contain at least one special character (!, @, #, $, %, ^, &, *)"
            );
          }

          // At least one number
          if (!/[0-9]/.test(value)) {
            errorMessages.push("Password must contain at least one number");
          }

          if (errorMessages.length > 0) {
            throw new Error(errorMessages.join(", "));
          }

          return true;
        },
        message: "Invalid password",
      },
    },

    phoneNumber: {
      type: String,
      validate: {
        validator: function (value) {
          const phoneNumberRegex = /^[0-9]{10}$/; // Regular expression for 10-digit phone number
          return phoneNumberRegex.test(value);
        },
        message: "Phone number must be a 10-digit number",
      },
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    oneTimePasswordChange: {
      type: Boolean,
      default: false,
    },

    resetToken: {
      type: String,
    },

    resetTokenExpiration: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    bio: {
      type: String,
    },

    dob: {
      type: Date,
    },

    location: {
      type: String,
    },

    profilePicture: {
      type: String,
    },

    googleId: {
      type: String,
      unique: true,
    },

    accountType: {
      type: String,
      enum: ["private", "public"],
      default: "public",
    },
  },
  { timestamps: true }
);

UserSchema.plugin(aggregatePaginate);
const User = mongoose.model("USER", UserSchema);
module.exports = User;
