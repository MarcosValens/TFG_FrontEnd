import validators from "./../../validators";
import getters from "./../../../../utils/getters";
import requests from "./../../../../utils/requests";
const register = getters.register;

export default {
  ...validators,
  displayPopup() {
    if (!this.implemented) return;
    this.$q.dialog({
      title: "Email verification",
      message: "We've sent an email to your account to verify you are a human. You may log in after you've validated it."
    })
  },
  async register(event) {
    this.errors = {};
    try {
      await requests.post.call(this, register.register(), this.user);
      this.canClose = true;
      this.$root.$emit("userRegistered", this.user);
      this.displayPopup();
      document.querySelector("#close-popup").click();
    } catch (e) {
      event.preventDefault();
      this.uniqueEmailErrorMessage = "This email already exists";
    }
  }
};
