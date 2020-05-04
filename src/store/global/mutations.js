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
