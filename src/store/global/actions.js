export function setUser({ commit }, user) {
  commit("setUser", user);
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

export function setCurrentPort({ commit }, port) {
  commit("updateCurrentPort", port);
}

export function updatePort({ commit }, port) {
  commit("updatePort", port);
}

export function setHosts({ commit }, hosts) {
  commit("setHosts", hosts); 
}

export function deleteHost({ commit }, host) {
  commit("deleteHost", host);
}

export function deletePort({ commit }, port) {
  commit("deletePort", port)
}