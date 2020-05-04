import globalRequestBuilder from "../../../utils/globalRequestBuilder";
import requests from "../../../utils/requests";
import validators from "../validators";
export default {
  isValidEmail: validators.isValidEmail,

  async login(event) {
    const errors = {
      global: []
    };
  
    this.$root.$emit("errors", errors);
    this.loggingIn = true;
  
    const { endpoint, dataFromBuilder } = globalRequestBuilder.call(
      this,
      "login",
      "local",
      this.user
    );
    try {
      const {token} = await requests.post.call(this, endpoint, dataFromBuilder);
      localStorage.setItem("token", token);
      this.$router.push("/main");
    } catch (e) {
      const response = e.response;
      if (response) {
        errors.global.push({ msg: response.data.message });
      } else {
        errors.global.push({msg: "Server is offline"})
      }
      this.$root.$emit("errors", errors);
      event.preventDefault();
    } finally {
      this.loggingIn = false;
    }
  }
};
