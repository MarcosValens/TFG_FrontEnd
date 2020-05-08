import getters from "../../../../../../utils/getters";

export default {
  async doFullScan(event) {
    try {
      getters.scanner.builder.checkInputAndGetPorts(this.ports);
      this.$root.$emit("portSingleHost", this.ports);
      this.canClose = true;
      document.querySelector("#close-popup").click();
    } catch (e) {
      this.message = e.message;
      event.preventDefault();
    }
  }
}
