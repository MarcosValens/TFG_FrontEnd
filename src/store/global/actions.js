export function addNetwork({ commit }, network) {
    commit("addNetwork", network);
}

export function updateNetworksFromBackend({ commit }, networks) {
    commit("updateNetworks", networks);
}

export function setCurrentNetwork({ commit }, network) {
    commit("updateCurrentNetwork", network);
}
