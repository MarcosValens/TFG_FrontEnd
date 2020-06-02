export default {
  isValidService(service) {
    // We allow empty services
    if (!service) return true;
    if (service.length > 255) {
      return "Service length cannot be of more than 255 characters";
    }
    return true;
  },
  isValidPort(port) {
    if (!port) return "Please enter a valid port number";
    if (port <= 0) return "Port number cannot be below or equal to 0";
    if (port > 65500) return "Port number cannot exceed 65500";
    return true;
  },
  isChanged() {
    return !(
      this.open === this.currentPort.open &&
      this.service === this.currentPort.service
    );
  }
};
