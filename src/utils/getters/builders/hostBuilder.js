export default {
  update: function (host) {
    return {
      description: host.description,
      networkId: this.currentNetwork._id,
      host,
      hostId: host._id
    };
  },
  updateSweep: function(hosts) {
    return {
      networkId: this.currentNetwork._id,
      hosts,
    };
  },
  create: function (hosts) {
    return {networkId: this.currentNetwork._id, hosts};
  },

  delete: function ({row}) {
    return {
      networkId: this.currentNetwork._id,
      hostId: row._id
    };
  },

  get: function () {
    return {
      networkId: this.currentNetwork._id
    }
  }
};
