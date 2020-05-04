const base = `${process.env.BACKEND_URL}/user`;

export default {
  profile() {
      return base;
  },
  image(id) {
      return `${base}/image/${id}`;
  },
  check() {
      return `${base}/check`
  }
};
