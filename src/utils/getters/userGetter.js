const base = `${process.env.BACKEND_URL}/user`;

export default {
  profile() {
      return base;
  },
  delete() {
      return `${base}/delete`;
  },
  update() {
      return `${base}/update`;
  },
  image(id) {
      return `${base}/image/${id}`;
  },
  check() {
      return `${base}/check`;
  },
  agreement() {
    return `${base}/accept`;
  },
  logout() {
      return `${base}/logout`;
  }
};
