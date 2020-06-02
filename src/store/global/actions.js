export function init({ commit }) {
  commit("init")
}
export function getHostPortsSorted({ commit }) {
  commit("getHostPortsSorted")
}

export function changeAutoDetect({ commit }) {
  commit("changeAutoDetect")
}

export function setUser({ commit }, user) {
  commit("setUser", user);
}

export function changeAgreement({ commit }) {
  commit("changeAgreement");
}

export function setUserImageUrl({ commit }, url) {
  commit("setUserImageUrl", url);
}

export function lockNetwork({ commit }) {
  commit("lockNetwork")
}
export function unlockNetwork({ commit }) {
  commit("unlockNetwork")
}

export function addNetwork({ commit }, network) {
  commit("addNetwork", network);
}

export function updateNetwork({ commit }, network) {
  commit("updateNetwork", network);
}

export function updateNetworksFromBackend({ commit }, networks) {
  commit("updateNetworks", networks);
}

export function setCurrentNetwork({ commit }, network) {
  commit("updateCurrentNetwork", network);
}

export function deleteNetwork({ commit }, network) {
  commit("deleteNetwork", network);
}

export function updateHostDescription({ commit }, description) {
  commit("updateHost", description);
}

export function setCurrentHost({ commit }, {row}) {
  commit("updateCurrentHost", row);
}

export function setHost({ commit }, host) {
  commit("setHost", host);
}

export function lockHost({ commit }) {
  commit("lockHost")
}

export function unlockHost({ commit }) {
  commit("unlockHost")
}

export function setCurrentPort({ commit }, port) {
  commit("updateCurrentPort", port);
}

export function updatePort({ commit }, port) {
  commit("updatePort", port);
}

export function setHosts({ commit }, hosts) {
  commit("setHosts", hosts); 
}

export function setHostsFromSweep({ commit }, hosts) {
  commit("setHostsFromSweep", hosts);
}

export function deleteHost({ commit }, host) {
  commit("deleteHost", host);
}

export function reviveHost({ commit }, index) {
  commit("reviveHost", index)
}

export function killHost({ commit }, { index }) {
  commit("killHost", index)
}

export function deletePort({ commit }, port) {
  commit("deletePort", port)
}
