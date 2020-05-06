const base = `${process.env.BACKEND_URL}/user`;

export default {
  profile() {
      return base;
  },
  update() {
      return `${base}/update` ;
  },
  image(id) {
      return `${base}/image/${id}`;
  },
  check() {
      return `${base}/check`;
  },
  logout() {
      return `${base}/logout`
  }
};
