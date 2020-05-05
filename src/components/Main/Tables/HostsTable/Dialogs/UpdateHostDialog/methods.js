import globalRequestBuilder from "../../../../../../utils/globalRequestBuilder";
import requests from "../../../../../../utils/requests";
import {mapActions} from "vuex";

export default {
  ...mapActions("global", ["updateHostDescription"]),
  async updateHost(ev) {
    if (!this.isChanged()) return this.close();
    try {
      this.updateHostDescription(this.description);
      const { endpoint, dataFromBuilder } = globalRequestBuilder.call(
        this,
        "host",
        "update",
        {
          host: this.currentHost,
          network: this.currentNetwork
        }
      );
      await requests.post.call(this, endpoint, dataFromBuilder);
      this.close();
    } catch (e) {
      console.log(e)
      ev.preventDefault();
    }
  },
  close() {
    this.canClose = true;
    document.querySelector("#close-popup").click();
  },
  isChanged() {
    return (this.currentHost.description !== this.description);
  }
}
