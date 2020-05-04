import builder from "./builders/scannerBuilder";

const base = process.env.SCANNER_URL;

export default {
  builder,

  ping: {
    host() {
      return `${base}/ping/host`;
    },
    sweep() {
      return `${base}/ping/sweep`
    },
    validIp() {
      return `${base}/ping/validate`;
    }
  },
  scan() {
    return `${base}/port`;
  },
  
};
