import Vue from 'vue';

export function addNetwork (state, network) {
    state.networks.push(network);
}

export function updateCurrentNetwork(state, network) {
    Vue.set(state, "currentNetwork", network);
}

export function updateNetworks(state, networks) {
    state.networks = networks;
}

export function deleteNetwork(state, network) {
  const networkIndex = state.networks.map(network => network._id).indexOf(network._id);
  state.networks.splice(networkIndex,1)
  state.networks = networks;
}
