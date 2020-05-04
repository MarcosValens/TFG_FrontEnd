export default {
  create({name, gateway}) {
    return {name, gateway};
  },
  update({_id, name, gateway}) {
    return {
      networkId: _id,
      name,
      gateway
    };
  },
  delete({_id}) {
    return {networkId: _id};
  }
};
