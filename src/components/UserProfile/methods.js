import { validate } from "secure-password-validator";
import getters from "./../../utils/getters";
import requests from "./../../utils/requests";

const errors = {
  MIN_LENGTH: "Password length must be minimum of 8 characters",
  LETTERS: "Password must contain one letter at least",
  UPPERCASE: "Password must contain at least one uppercase character",
  LOWERCASE: "Password must contain a lower case",
  MAX_LENGTH: "Password cannot be more than 50 characters long",
  SYMBOLS: "Password must contain one special character, like @",
  DIGITS: "Password must contain at least one number"
};

import { mapActions } from "vuex";
const userGetter = getters.user;
export default {
  ...mapActions("global", ["setUserImageUrl", "setUser"]),
  async onSubmit() {
    const formData = new FormData();
    formData.append("name", this.name);
    formData.append("surname", this.surname);
    formData.append("image", this.image);
    formData.append("userId", this.userId);
    formData.append("password", this.newPassword);
    try {
      await this.$axios.post(userGetter.update(), formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      this.setUserImageUrl(`${this.userImageUrl}?date=${Date.now()}`);
      const user = await requests.get.call(this, userGetter.profile());
      this.setUser(user);
      this.$router.push("/main");
    } catch (e) {
      console.log(e);
      // TODO: Display errors
    }
  },
  counterLabelFn({ totalSize, filesNumber, maxFiles }) {
    return `${filesNumber} files of ${maxFiles} | ${totalSize}`;
  },
  prompt() {
    this.generateRandomId(10);
    this.$q
      .dialog({
        title: "Delete account",
        html: true,
        message: `Write <strong>${this.deleteCode}</strong> to confirm.`,
        prompt: {
          model: "",
          type: "text",
          label: `Write the following code: ${this.deleteCode}`,
          isValid: val => val === this.deleteCode
        },
        ok: {
          push: true,
          color: "negative",
          label: "Delete"
        },
        cancel: true,
        persistent: true
      })
      .onOk(data => {
        this.deleteUser();
        localStorage.clear();
      });
  },
  async deleteUser() {
    try {
      await this.$axios.delete(userGetter.delete());
      this.$router.push("/login");
    } catch (e) {}
  },
  generateRandomId(iterations) {
    const words = "abcdef0123456789";
    let code = "";
    for (let i = 0; i < iterations; i++) {
      code += words[Math.floor(Math.random() * words.length)];
    }
    this.deleteCode = code;
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
    });

    if (!results.valid) return errors[results.errors[0]];
    return true;
  }
};
