import {validate} from 'secure-password-validator';
const errors = {
  MIN_LENGTH: "Password length must be minimum of 8 characters",
  LETTERS: "Password must contain one letter at least",
  UPPERCASE: "Password must contain at least one uppercase character",
  LOWERCASE: "Password must contain a lower case",
  MAX_LENGTH: "Password cannot be more than 50 characters long",
  SYMBOLS: "Password must contain one special character, like @",
  DIGITS: "Password must contain at least one number"
}
export default {
  isValidEmail(email) {
    const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(email) || "Invalid email";
  },
  isUniqueEmail() {
    return this.errors.email;
  },
  validatePassword(password) {
    const results = validate(password, {
      minLength: 8,
      maxLength: 50,
      digits: true,
      letters: true,
      uppercase: true,
      symbols: true,
      lowercase: true
    })

    if (!results.valid) return errors[results.errors[0]];
    return true;
  }
};
