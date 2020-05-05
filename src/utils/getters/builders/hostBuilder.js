export default {
  update: function ({network, host}) {
    return {
      description: host.description,
      networkId: network._id,
      host,
      hostId: host._id
    };
  },
  updateSweep: function({network, hosts}) {
    return {
      networkId: network._id,
      hosts,
    };
  },
  create: function ({network, hosts}) {
    return {networkId: network._id, hosts};
  },

  delete: function ({network, row}) {
    return {
      networkId: network._id,
      hostId: row._id
    };
  },

  get: function (network) {
    return {
      networkId: network._id
    }
  }
};
