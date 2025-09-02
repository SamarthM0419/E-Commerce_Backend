const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Enter firstName and lastName");
  }

  if (firstName.length < 2 || lastName.length < 2) {
    throw new Error("Name must be at least 2 characters long");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("EmailId is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter a Strong Password");
  }
};

const validateEditProfileData = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "gender",
    " photoUrl",
    "addresses",
  ];

  const isEditAllowed = Object.keys(req.body).every((fields) =>
    allowedFields.includes(fields)
  );

  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
