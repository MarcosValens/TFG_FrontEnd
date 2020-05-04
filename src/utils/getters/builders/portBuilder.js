export default {
  update: function (port) {
    return {
      networkId: this.currentNetwork._id,
      hostId: this.currentHost._id,
      portId: port._id,
      portNumber: port.port,
      open: port.open,
      service: port.service,
      port
    };
  },
  create: function ({ports, host}) {
    return {
      hostId: host._id,
      networkId: this.currentNetwork._id,
      ports
    };
  },

  delete: function (port) {
    return {
      hostId: this.currentHost._id,
      networkId: this.currentNetwork._id,
      portId: port._id
    };
  }
};
