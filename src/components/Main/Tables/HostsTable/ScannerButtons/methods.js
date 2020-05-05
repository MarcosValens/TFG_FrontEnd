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

function removeDuplicates(array) {
  const set = new Set(array.map(({ _id }) => _id));
  return Array.from(set).map(id => array.find(({ _id }) => _id === id));
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
    await requests.post.call(this, endpoint, dataFromBuilder);
    return hosts;
  },

  async updateHost(host) {
    const { endpoint, dataFromBuilder } = globalRequestBuilder.call(
      this,
      "host",
      "update",
      {
        network: this.currentNetwork,
        host
      }
    );
    await requests.post.call(this, endpoint, dataFromBuilder);
  },

  async createPorts(ports, host) {
    const { endpoint, dataFromBuilder } = globalRequestBuilder.call(
      this,
      "port",
      "create",
      {
        ports,
        host
      }
    );
    const hostFromDataBase = requests.post.call(
      this,
      endpoint,
      dataFromBuilder
    );
    return hostFromDataBase;
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
      const hosts = await this.updateHosts(data.hostsToUpdate);
      this.setHosts(hosts);
    }
    this.addHosts(databaseHosts);

    this.progressMessage = `${newHostsMessage}. ${
      deadHostsMessage ? `And ${deadHostsMessage}` : ""
    }`;
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
      const wasDead = this.hosts[formattedHost.index].alive
        ? "Host is alive but it's already inside the list of hosts."
        : "Host was dead but now is alive";
      this.persistentMessage = "";
      this.reviveHost(formattedHost.index);
      await this.updateHost(this.hosts[formattedHost.index]);
      this.progressMessage = wasDead;
      return;
    }

    const hosts = await createHosts.call(this, formattedHost.hosts);
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
      await this.sweep();
      const hostsToScan = this.hosts.filter(host => host.alive);
      const hostsMessage =
        this.hosts.length === 1 ? "one host" : `${hostsToScan.length} hosts`;
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
      return removeDuplicates([...hosts, ...this.hosts]);
    } catch (e) {
      throw e;
    }
  }
};
