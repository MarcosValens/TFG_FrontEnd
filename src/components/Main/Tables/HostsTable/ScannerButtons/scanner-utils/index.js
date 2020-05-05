function getIndex(array, property, value) {
  return array.map((object) => object[property]).indexOf(value);
}
export default {
  
  parseHosts: async function(hostsFromSweep) {
    const newHostsFromSweep = hostsFromSweep.filter(host => {
      const index = getIndex(this.hosts, "ipAddress", host.address);
      return index === -1;  
    }).map(host => {
      return {ipAddress: host.address, alive: true, description: "", ports: []}
    });
    const deadHosts = this.hosts.filter(host => {
      const index = getIndex(hostsFromSweep, "address", host.ipAddress);
      return index === -1;  
    });
    const hostsToUpdate = this.hosts.map(host => {
      const hostToAdd = {...host};
      if (getIndex(deadHosts, "ipAddress", host.ipAddress) !== -1) {
        hostToAdd.alive = false;
      } else {
        hostToAdd.alive = true;
      }
      return hostToAdd;
    })
    return {newHostsFromSweep, deadHosts, hostsToUpdate};
  },

  parseIpObject: function(ip) {
    const isProps = typeof ip === "object";
    console.log(isProps)
    if (isProps) {
      ip = ip.row.ipAddress;
    }
    return ip;
  },
  formatAndCheckIfNewHost: async function(host) {
    if (host.error) {
      throw { message: host.error.response.data.message };
    }

    const ipAddress = host.isLiving.host;
    const hostIndex = getIndex(this.hosts, "ipAddress", ipAddress);
    if (!host.isLiving.alive) {
      if (hostIndex !== -1) {
        this.killHost({index: hostIndex});
        await this.updateHosts([this.hosts[hostIndex]]);
      }
      throw {
        message: "Host is not alive or not responding to ICMP requests."
      };
    }
    const data = {
      canAdd: hostIndex === -1,
      alive: host.isLiving.alive,
      index: hostIndex,
      hosts: [
        {
          ipAddress: ipAddress,
          description: "",
          ports: [],
          alive: true
        }
      ]
    };
    return data;
  }
};
