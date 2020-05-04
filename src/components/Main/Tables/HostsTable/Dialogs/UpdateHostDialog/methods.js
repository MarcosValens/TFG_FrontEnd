import globalRequestBuilder from "../../../../../../utils/globalRequestBuilder"
import {mapActions} from "vuex";

export default {
  ...mapActions("global", ["updateHost"]),
  async updateHost(ev) {
    if (!this.isChanged()) return this.close();
    try {
      this.updateHost(this.description);
      const { endpoint, dataFromBuilder } = globalRequestBuilder.call(
        this,
        "host",
        "update",
        this.currentHost
      );
      this.close();
    } catch (e) {
      ev.preventDefault();
    }
  },
  close() {
    document.querySelector("#close-popup").click();
  },
  isChanged() {
    return (this.currentHost.description === this.description);
  }
}
