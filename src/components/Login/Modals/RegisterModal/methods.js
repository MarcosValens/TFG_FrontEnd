import validators from "./../../validators";
import getters from "./../../../../utils/getters";
import requests from "./../../../../utils/requests";
const register = getters.register;

export default {
  ...validators,
  async register(event) {
    this.errors = {};
    try {
      await requests.post.call(this, register.register(), this.user);
      this.canClose = true;
      this.$root.$emit("userRegistered", this.user);
      document.querySelector("#close-popup").click();
    } catch (e) {
      event.preventDefault();
      this.uniqueEmailErrorMessage = "This email already exists";
    }
  }
};
