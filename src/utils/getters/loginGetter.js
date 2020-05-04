import builder from "./builders/loginBuilder";
export default {
  base: `${process.env.BACKEND_URL}/login`,
  builder,

  local() {
    return `${this.base}/local`;
  },
  google() {
    return `${this.base}/google`;
  }
};
