import Vue from 'vue';


// Helpers
function getNetworkIndex(state, network) {
  const networkIndex = state.networks.map(network => network._id).indexOf(network._id);
  return networkIndex;
}

function getHostIndex(state, host) {
  const hostIndex = state.hosts.map(host => host._id).indexOf(host._id);
  return hostIndex;
}

function getPortIndex(state, port) {
  const hostIndex = getHostIndex(state, state.currentHost);
  const portIndex = state.hosts[hostIndex].ports.map(port => port._id).indexOf(port._id);
  return {port: portIndex, host: hostIndex};
}

// User
export function setUser(state, user) {
  Vue.set(state, "user", user);
}

// Networks
export function addNetwork(state, network) {
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

// Hosts
export function setHosts(state, hosts) {
  Vue.set(state, "hosts", hosts);
}

export function setHostsFromSweep(state, hosts) {
  const newHosts = state.hosts.concat(hosts);
  Vue.set(state, "hosts", newHosts);
}

export function updateHost(state, description){
  const hostIndex = getHostIndex(state, state.currentHost);
  Vue.set(state.currentHost, "description", description);
  Vue.set(state.hosts, hostIndex, state.currentHost);
}

export function updateCurrentHost(state, host) {
  Vue.set(state, "currentHost", host);
}

export function updateCurrentPort(state, port) {
  Vue.set(state, "currentPort", port);
}

export function deleteHost(state, host) {
  const hostIndex = getHostIndex(state, host);
  state.hosts.splice(hostIndex, 1);
}

// Ports
export function updatePort(state, {open, service}) {
  const indexes = getPortIndex(state, state.currentPort);
  Vue.set(state.currentPort, "open", open);
  Vue.set(state.currentPort, "service", service);
  Vue.set(state.hosts[indexes.host].ports, indexes.port, state.currentPort);
}

export function deletePort(state, port) {
  const indexes = getPortIndex(state, port);
  state.hosts[indexes.host].ports.splice(indexes.port, 1);
}
