function ipSort(ipAddressArray) {
	return ipAddressArray.sort( function(a, b) {
		a = a.ipAddress.split('.');
		b = b.ipAddress.split('.');
		for( let i = 0; i < a.length; i++ ) {
			if( ( a[i] = parseInt( a[i] ) ) < ( b[i] = parseInt( b[i] ) ) )
				return -1;
			else if( a[i] > b[i] )
				return 1;
		}
		return 0;
	} );
} 


export function darkMode (state) {
    return state.darkMode;
}

export function networks(state) {
    return state.networks;
}

export function currentNetwork(state) {
    return state.currentNetwork;
}

export function currentHost(state) {
    return state.currentHost;
}

export function hosts(state) {
    const sortedHosts = ipSort(state.hosts);
    console.log(sortedHosts)
    return sortedHosts;
}

export function currentPort(state) {
    return state.currentPort;
}

export function user(state) {
    return state.user;
}

export function userImageUrl(state) {
    return state.userImageUrl;
}