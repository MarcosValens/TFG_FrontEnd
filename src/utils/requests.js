export default {
  post: async function (endpoint, data) {
    try {
      const response = await this.$axios.post(endpoint, data);

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  get: async function (endpoint, data = "") {
    try {
      const response = await this.$axios.get(`${endpoint}/${data}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  delete: async function(endpoint) {
    try {
      await this.$axios.delete(endpoint);
    } catch(e) {
      throw e;
    }
  }
};
