import getters from "./../../../../../../utils/getters";

export default {
  async doFullScan(event) {
    try {
      getters.scanner.builder.checkInputAndGetPorts(this.ports);
      this.$root.$emit("portSingleHost", this.ports);
      this.canClose = true;
    } catch (e) {
      this.message = e.message;
      event.preventDefault();
    }
  }
}
