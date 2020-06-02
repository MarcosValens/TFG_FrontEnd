import Vue from "vue";

// Init
export function init(state) {
  const currentNetwork = JSON.parse(localStorage.getItem("current-network"));
  const hosts = JSON.parse(localStorage.getItem("hosts"));
  const currentHost = JSON.parse(localStorage.getItem("current-host"));
  const user = JSON.parse(localStorage.getItem("user"))
  // Man don't care about current port for now
  //const currentPort = JSON.parse(localStorage.getItem("current-port"));
  // Only if we have the hosts
  if (currentNetwork && hosts) {
    Vue.set(state, "currentNetwork", currentNetwork);
    Vue.set(state, "hosts", hosts);
  }

  if (currentHost) {
    Vue.set(state, "currentHost", currentHost);
  }

  if (user) {
    Vue.set(state, "user", user);
  }
}

// Helpers
function getNetworkIndex(state, network) {
  const networkIndex = state.networks
    .map(network => network._id)
    .indexOf(network._id);
  return networkIndex;
}

function getHostIndex(state, host) {
  const hostIndex = state.hosts.map(host => host._id).indexOf(host._id);
  return hostIndex;
}

function getPortIndex(state, port) {
  const hostIndex = getHostIndex(state, state.currentHost);
  const portIndex = state.hosts[hostIndex].ports
    .map(port => port._id)
    .indexOf(port._id);
  return { port: portIndex, host: hostIndex };
}

function ipSort(ipAddressArray) {
  return ipAddressArray.sort(function(a, b) {
    a = a.ipAddress.split(".");
    b = b.ipAddress.split(".");
    for (let i = 0; i < a.length; i++) {
      if ((a[i] = parseInt(a[i])) < (b[i] = parseInt(b[i]))) return -1;
      else if (a[i] > b[i]) return 1;
    }
    return 0;
  });
}

// User
export function setUser(state, user) {
  Vue.set(state, "user", user);
  localStorage.setItem("user", JSON.stringify(user))

}

export function changeAgreement(state) {
  Vue.set(state.user, "userAgreementAccepted", true);
  localStorage.setItem("user", JSON.stringify(state.user));
}

export function setUserImageUrl(state, url) {
  Vue.set(state, "userImageUrl", url);
  localStorage.setItem("user", JSON.stringify(state.user));
}
// Networks
export function lockNetwork(state) {
  Vue.set(state.currentNetwork, "locked", true);
  localStorage.setItem("current-network", JSON.stringify(state.currentNetwork));
}

export function unlockNetwork(state) {
  Vue.set(state.currentNetwork, "locked", false);
  localStorage.setItem("current-network", JSON.stringify(state.currentNetwork));
}

export function addNetwork(state, network) {
  state.networks.push(network);
}

export function updateCurrentNetwork(state, network) {
  localStorage.setItem("current-network", JSON.stringify(network));
  Vue.set(state, "currentNetwork", network);
}

export function updateNetworks(state, networks) {
  state.networks = networks;
}

export function deleteNetwork(state, network) {
  state.networks.splice(getNetworkIndex(state, network), 1);
}

export function updateNetwork(state, network) {
  localStorage.setItem("current-network", JSON.stringify(network));
  Vue.set(state, "currentNetwork", network);
  Vue.set(state.networks, getNetworkIndex(state, network), network);
}

// Hosts
export function getHostPortsSorted(state) {
  const sorted = state.currentHost.ports.sort((a, b) => a.port - b.port);
  Vue.set(state.currentHost, "ports", sorted);
}

export function lockHost(state) {
  Vue.set(state.currentHost, "locked", true);
  localStorage.setItem("current-host", JSON.stringify(state.currentHost));
}

export function unlockHost(state) {
  Vue.set(state.currentHost, "locked", false);
  localStorage.setItem("current-host", JSON.stringify(state.currentHost));

}

export function setHosts(state, hosts) {
  const sortedHosts = ipSort(hosts)
  localStorage.setItem("hosts", JSON.stringify(sortedHosts));
  Vue.set(state, "hosts", sortedHosts);
}

export function setHostsFromSweep(state, hosts) {
  const newHosts = state.hosts.concat(hosts);
  localStorage.setItem("hosts", JSON.stringify(newHosts));

  Vue.set(state, "hosts", ipSort(newHosts));
}

export function updateHost(state, description) {
  const hostIndex = getHostIndex(state, state.currentHost);
  Vue.set(state.currentHost, "description", description);
  Vue.set(state.hosts, hostIndex, state.currentHost);
  localStorage.setItem("current-host", JSON.stringify(state.currentHost))
  localStorage.setItem("hosts", JSON.stringify(state.hosts))

}

export function setHost(state, host) {
  const hostIndex = getHostIndex(state, state.currentHost);
  Vue.set(state, "currentHost", host);
  Vue.set(state.hosts, hostIndex, state.currentHost);
  localStorage.setItem("current-host", JSON.stringify(host))
  localStorage.setItem("hosts", JSON.stringify(state.hosts))
}

export function updateCurrentHost(state, host) {
  host.locked = false;
  Vue.set(state, "currentHost", host);
  localStorage.setItem("current-host", JSON.stringify(host))

}

export function reviveHost(state, index) {
  console.log(index)
  Vue.set(state.hosts[index], "alive", true);
  localStorage.setItem("current-host", JSON.stringify(state.hosts[index]))
}

export function killHost(state, index) {
  Vue.set(state.hosts[index], "alive", false);
  localStorage.setItem("current-host", JSON.stringify(state.hosts[index]))

}

export function deleteHost(state, host) {
  const hostIndex = getHostIndex(state, host);
  state.hosts.splice(hostIndex, 1);
  localStorage.setItem("hosts", JSON.stringify(state.hosts))

}

// Ports
export function updatePort(state, { open, service }) {
  const indexes = getPortIndex(state, state.currentPort);
  Vue.set(state.currentPort, "open", open);
  Vue.set(state.currentPort, "service", service);
  Vue.set(state.hosts[indexes.host].ports, indexes.port, state.currentPort);
  localStorage.setItem("current-host", JSON.stringify(state.currentHost))
  localStorage.setItem("hosts", JSON.stringify(state.hosts))
}

export function updateCurrentPort(state, port) {
  Vue.set(state, "currentPort", port);
  
  localStorage.setItem("current-host", JSON.stringify(state.currentHost))
  localStorage.setItem("hosts", JSON.stringify(state.hosts))
}

export function deletePort(state, port) {
  const indexes = getPortIndex(state, port);
  state.hosts[indexes.host].ports.splice(indexes.port, 1);
  
  localStorage.setItem("current-host", JSON.stringify(state.currentHost))
  localStorage.setItem("hosts", JSON.stringify(state.hosts))
}

// Other
export function changeAutoDetect(state) {
  Vue.set(state, "autoDetect", !state.autoDetect);
  localStorage.setItem("auto-detect", state.autoDetect);
}