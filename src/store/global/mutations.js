import Vue from 'vue';

function getNetworkIndex(state, network) {
  const networkIndex = state.networks.map(network => network._id).indexOf(network._id);
  return networkIndex;
}

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
  state.networks.splice(getNetworkIndex(state, network),1)
}

export function updateNetwork(state, network) {
    Vue.set(state, "currentNetwork", network);
    Vue.set(state.networks, getNetworkIndex(state, network), network);
}
