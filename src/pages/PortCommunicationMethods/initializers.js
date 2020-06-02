export default {
  initPort(isDelete = false) {
    this.portErrors = [];
    const portError = this.isValidPort(this.port.port);
    if (typeof portError === "string") {
      this.portErrors.push(portError);
      return false;
    }
    const hostPort = this.findPort(this.currentHost);
    if (!hostPort && isDelete) {
      this.portErrors.push(
        "This port is not registered on this host. Please scan it"
      );
      return false;
    }
    return true;
  },
  initPayload() {
    const portErrors = this.isValidPort(this.port.port);
    this.payloadErrors = [];
    if (typeof portError === "string") {
      this.payloadErrors.push(portError);
      return false;
    }
    const hostPort = this.findPort(this.currentHost);
    if (!hostPort) {
      this.payloadErrors.push(
        "That port is not registered in this host. Please scan it or check if it's open"
      );
      return false;
    }
    return true;
  }
};
