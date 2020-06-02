import privateIp from 'private-ip';
import isIp from 'is-ip';
import requests from "../../../../../../utils/requests";
import getters from "../../../../../../utils/getters";

export default {
  async sendIp(event) {
    this.message = null;
    try {
      const endpoint = getters.scanner.ping.validIp();
      await requests.get.call(this, endpoint, this.host);
      this.$root.$emit("ip", this.host);
      document.querySelector("#close-popup").click();
    } catch (e) {
      event.preventDefault();
      this.message = e.message;
    }
  },
  isValid(ip) {
    if (!isIp(ip)) {
      return "Please input a valid IP address"
    }

    if (!privateIp(ip)) {
      return "That's not a private IP"
    }
    return true;
  }
}
