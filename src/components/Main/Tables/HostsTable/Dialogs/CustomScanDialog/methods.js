import getters from "../../../../../../utils/getters";

export default {
  async sendPorts(event) {
    try {
      getters.scanner.builder.checkInputAndGetPorts(this.ports);
      this.$root.$emit("ports", this.ports);
      this.canClose = true;
    } catch (e) {
      this.message = e.message;
      event.preventDefault();
    }
  }
}
