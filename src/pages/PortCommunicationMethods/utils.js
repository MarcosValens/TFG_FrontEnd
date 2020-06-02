export default {
  clone(data) {
    if (!data) return {};
    return JSON.parse(JSON.stringify(data));
  },
  async sendKillHost(host) {
    const index = this.hosts.map(({_id}) => _id).indexOf(host._id);
    await this.killHost({index});
    await this.updateHost(host); 
  },
  async sendReviveHost(host) {
    const index = this.hosts.map(({_id}) => _id).indexOf(host._id);
    await this.reviveHost(index);
    await this.updateHost(host); 
  },
  saveInput(value) {
    localStorage.setItem('auto-detect', value)
  },
  async insertNewPortAndUpdatePortList(data) {
    const host = await this.createPorts([data], this.currentHost);
    const hostPort = this.findPort(host);
    this.setHost(host);
    this.setPort(hostPort);
    this.getHostPortsSorted();
  },
  setPort(port) {
    this.setCurrentPort(port);
    this.port = this.clone(this.currentPort);
  },
  findPort(host) {
    return host.ports.find(
      ({ port }) => parseInt(port) === parseInt(this.port.port)
    );
  },
  detectPort() {
    const hostPort = this.findPort(this.currentHost);
    if (!hostPort) return (this.port.service = ""), (this.port.open = false);
    this.port.service = hostPort.service;
    this.port.open = hostPort.open;
  }
};
