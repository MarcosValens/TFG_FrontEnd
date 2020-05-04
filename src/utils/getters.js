import network from './getters/networkGetter';
import host from './getters/hostGetter';
import port from './getters/portGetter';
import login from './getters/loginGetter';
import register from './getters/registerGetter';
import user from './getters/userGetter';
import scanner from './getters/scannerGetter';

const getters = {network, host, port, login, register, user};
if (process.env.ENVIRONMENT === "electron") {
  getters.scanner = scanner;
}

export default getters;
