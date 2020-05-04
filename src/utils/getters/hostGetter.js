import builder from "./builders/hostBuilder.js";

export default {
  base: `${process.env.BACKEND_URL}/hosts`,
  builder,

  update() {
    return `${this.base}/update`;
  },
  updateSweep() {
    return `${this.base}/updateSweep`;
  },
  create() {
    return `${this.base}/create`;
  },

  delete() {
    return `${this.base}/delete`;
  },

  getOne() {
    return this.base;
  },

  get() {
    return `${this.base}/all`;
  }
};
