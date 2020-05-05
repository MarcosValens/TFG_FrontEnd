export default {
  update: function ({network, host, port}) {
    return {
      networkId: network._id,
      hostId: host._id,
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

  delete: function ({network, host, port}) {
    return {
      hostId: host._id,
      networkId: network._id,
      portId: port._id
    };
  }
};
