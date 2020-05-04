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

export function updateHost({ commit }, description) {
  commit("updateHost", description);
}
