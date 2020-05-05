import requests from "./../../../../../utils/requests";
import getters from "./../../../../../utils/getters";
import globalRequestBuilder from "./../../../../../utils/globalRequestBuilder";

import utils from "./scanner-utils/index";

async function createHosts(hosts) {
  const { endpoint, dataFromBuilder } = globalRequestBuilder.call(
    this,
    "host",
    "create",
    {
      network: this.currentNetwork,
      hosts
    }
  );
  return await requests.post.call(this, endpoint, dataFromBuilder);
}

function getDeadHostsMessage({ deadHosts }) {
  const amount = deadHosts.length;
  const message = amount
    ? amount === 1
      ? "One host didn't reply to our ping request"
      : `${amount} hosts didn't reply to our ping requests`
    : "";
  return message;
}

async function checkForDeadHosts(data) {
  const deadHostsMessage = getDeadHostsMessage(data);
  await this.updateHosts(data.hostsToUpdate);
  this.setHosts(data.hostsToUpdate);
  this.progressMessage = `No new hosts were found. ${deadHostsMessage}`;
  return { hosts: data.hostsToUpdate, canAdd: false };
}

function getNewHostsMessage(hosts) {
  const amount = hosts.length;
  return amount === 1
    ? "One host replied to our ping request"
    : `${amount} hosts replied to our ping requests`;
}
export default {
  async updateHosts(hosts) {
    const { endpoint, dataFromBuilder } = globalRequestBuilder.call(
      this,
      "host",
      "updateSweep",
      {
        network: this.currentNetwork,
        hosts
      }
    );
    this.setHosts(hosts);
    await requests.post.call(this, endpoint, dataFromBuilder);
  },
  async _sweep() {
    const endpoint = getters.scanner.ping.sweep();
    const hosts = await requests.get.call(this, endpoint);
    const parsedHosts = await utils.parseHosts.call(this, hosts);
    return parsedHosts;
  },
  async sweep() {
    this.progressMessage = "Sweep started.";
    const data = await this._sweep();

    if (!data.newHostsFromSweep.length) {
      return await checkForDeadHosts.call(this, data);
    }
    this.persistentMessage = "Sweep completed.";

    const newHostsMessage = getNewHostsMessage(data.newHostsFromSweep);
    const databaseHosts = await createHosts.call(this, data.newHostsFromSweep);
    const deadHostsMessage = getDeadHostsMessage(data);

    if (data.hostsToUpdate.length) {
      await this.updateHosts(data.hostsToUpdate);
    }
    this.progressMessage = `${newHostsMessage}. ${
      deadHostsMessage ? `And ${deadHostsMessage}` : ""
    }`;
    return {hosts: databaseHosts, canAdd: true};
  },

  async ping(data) {
    const endpoint = getters.scanner.ping.host();
    const ip = getters.scanner.builder.ping.host(utils.parseIpObject(data));

    this.persistentMessage = `Pinging host: ${data}.`;

    const pingResponse = await requests.post.call(this, endpoint, ip);

    this.persistentMessage = "We got a response from the scanner.";

    const formattedHost = await utils.formatAndCheckIfNewHost.call(
      this,
      pingResponse
    );

    if (formattedHost.alive) {
      this.persistentMessage = "Host is alive.";
    }

    if (!formattedHost.alive) {
      throw { message: "Host is not alive." };
    }

    if (!formattedHost.canAdd && formattedHost.alive) {
      this.persistentMessage = "";
      this.progressMessage =
        "Host is alive but it's already inside the list of hosts.";
      return;
    }

    this.persistentMessage = "Adding host to our database.";
    const hosts = await this.createHosts(formattedHost.hosts);
    this.persistentMessage = "";
    this.progressMessage = "Host successfully saved to our database.";
    return hosts;
  },

  async performPortScan(ip, inputPorts = null) {
    const endpoint = getters.scanner.scan();
    const data = getters.scanner.builder.port.call(this, ip, inputPorts);
    const results = await requests.post.call(this, endpoint, data);
    if (results.error) return false;
    return results;
  },

  async performSimpleScan(hostToScan = null, ports = null) {
    const address = hostToScan.ipAddress;
    const results = await this.performPortScan(address, ports);
    if (!results.length) return hostToScan;
    const host = await this.createPorts(results, hostToScan);
    return host;
  },

  async performFullScan(ports = null) {
    try {
      const withPorts = ports
        ? `with the port range of ${ports}`
        : "with the default ports";
      this.persistentMessage = `Starting full scan ${withPorts}`;
      getters.scanner.builder.checkInputAndGetPorts.call(this, ports);
      const sweepHosts = await this.sweep();
      const ourIps = this.hosts.map(({ ipAddress }) => ipAddress);
      const filteredHosts = sweepHosts.filter(
        ({ ipAddress }) => ourIps.indexOf(ipAddress) === -1
      );

      let hostsToScan = this.hosts.concat(filteredHosts);
      if (!hostsToScan.length) return;
      const hostsMessage =
        hostsToScan.length === 1 ? "one host" : `${hostsToScan.length} hosts`;
      const specifiedPorts = ports
        ? "using custom ports"
        : "using scanner's default ports";
      const portsMessage = `Scanning ${specifiedPorts} of ${hostsMessage}`;
      this.progressMessage = portsMessage;
      const hosts = await Promise.all(
        hostsToScan.map(host => this.performSimpleScan.call(this, host, ports))
      );
      this.persistentMessage = "";
      this.progressMessage = "Port scan finished";
      return hosts;
    } catch (e) {
      throw e;
    }
  }
};
