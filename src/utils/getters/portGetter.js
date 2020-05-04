import builder from "./builders/portBuilder";

export default {
  base: `${process.env.BACKEND_URL}/ports`,
  builder,

  update() {
    return `${this.base}/update`;
  },
  create() {
    return `${this.base}/create`;
  },

  delete() {
    return `${this.base}/delete`;
  }
};
