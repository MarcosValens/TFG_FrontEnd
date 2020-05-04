import builder from "./builders/registerBuilder";

export default {
  base: `${process.env.BACKEND_URL}/register`,
  builder,

  register() {
    return this.base;
  }
};
