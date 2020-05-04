import Vue from 'vue';

function getNetworkIndex(state, network) {
  const networkIndex = state.networks.map(network => network._id).indexOf(network._id);
  return networkIndex;
}

function getHostIndex(state, host) {
  const hostIndex = state.hosts.map(host => host._id).indexOf(host._id);
  return hostIndex;
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

export function updateHost(state, description){
  Vue.set(state.currentHost, "description", description);
  Vue.set(state.hosts, getHostIndex(state, state.currentHost), state.currentHost)
}

