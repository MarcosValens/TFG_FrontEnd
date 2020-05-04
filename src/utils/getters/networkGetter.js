import builder from "./builders/networkBuilder";

export default {
  base: `${process.env.BACKEND_URL}/network`,
  builder,

  update() {
    return `${this.base}/update`;
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
  getAll() {
    return `${this.base}/all`
  }
};

