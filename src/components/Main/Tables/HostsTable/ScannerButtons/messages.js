export default {
  fullScanMessages: {
    initMessage(ports = null) {
      const isSinglePort = ports && !(ports.includes("-") || ports.includes(","));

      return ports
        ? isSinglePort
          ? `with port number ${ports}`
          : `with the port range of ${ports}`
        : "with the default ports";
    },
    howManyHosts(ourHosts, hostsToScan) {
      return ourHosts.length === 1 ? "one host" : `${hostsToScan.length} hosts`;
    },
    whatPorts(ports = null) {
      const isSinglePort = ports && !(ports.includes("-") || ports.includes(","));
      return ports
        ? isSinglePort
          ? `using port ${ports}`
          : "using custom ports"
        : "using scanner's default ports";
    },
  },
  ping: {
    wasHostAlive(alive) {
      return alive
        ? "Host is alive but it's already inside the list of hosts."
        : "Host was dead but now is alive";
    },
  },
  sweep: {
    getNewHostsMessage(hosts) {
      const amount = hosts.length;
      return amount === 1
        ? "one host replied to our ping request"
        : `${amount} hosts replied to our ping requests`;
    },
    howManyDeadHosts(deadHosts) {
      const amount = deadHosts.length;
      const message = amount
        ? amount === 1
          ? "One host didn't reply to our ping request"
          : `${amount} hosts didn't reply to our ping requests`
        : "";
      return message;
    },
    howManyAliveHosts(ourHosts, data) {
      const ourDeadHosts = ourHosts
        .filter(({ alive }) => !alive)
        .map(({ ipAddress }) => ipAddress);
      const broughtBackToLifeHosts = data.hostsToUpdate.filter((host) => {
        return ourDeadHosts.includes(host.ipAddress) && host.alive;
      });
      const amount = broughtBackToLifeHosts.length;
      return amount
        ? amount === 1
          ? "One host came back from the dead"
          : `${amount} hosts came back from the dead`
        : "";
    },
  },
};
