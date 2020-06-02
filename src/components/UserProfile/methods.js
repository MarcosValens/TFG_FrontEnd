import getters from './../../utils/getters';
import { mapActions } from 'vuex';
const userGetter = getters.user;
export default {
    ...mapActions("global", ["setUserImageUrl"]),
    async onSubmit() {
      const formData = new FormData();
      formData.append("name", this.name);
      formData.append("surname", this.surname);
      formData.append("image", this.image);
      formData.append("userId", this.userId);
      formData.append("password", this.newPassword);
      try {
        await this.$axios.post(userGetter.update(), formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        this.setUserImageUrl(`${this.userImageUrl}?date=${Date.now()}`);
        this.$router.push("/main")
      } catch (e) {
        // TODO: Display errors
      }
    },
    counterLabelFn({totalSize, filesNumber, maxFiles}) {
      return `${filesNumber} files of ${maxFiles} | ${totalSize}`;
    },
    prompt() {
      this.generateRandomId(10);
      this.$q.dialog({
        title: 'Delete account',
        html: true,
        message: `Write <strong>${this.deleteCode}</strong> to confirm.`,
        prompt: {
          model: '',
          type: 'text',
          label: `Write the following code: ${this.deleteCode}`,
          isValid: val => val === this.deleteCode
        },
        ok: {
          push: true,
          color: 'negative',
          label: 'Delete'
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        this.deleteUser();
        localStorage.clear();
      })
    },
    async deleteUser() {
      try {
        await this.$axios.delete(userGetter.delete());
        this.$router.push("/login");
      } catch(e) {
      }
    },
    generateRandomId(iterations) {
      const words = "abcdef0123456789";
      let code = "";
      for (let i = 0; i < iterations; i++) {
        code += words[Math.floor(Math.random() * words.length)];
      }
      this.deleteCode = code;
    }
}
