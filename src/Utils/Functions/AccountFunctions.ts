import axios from "axios";

const createUserAccount = async (email: string, password: string, name: string) => {
  axios
    .post('https://marhaba-server.onrender.com/api/account/createAccount', {
      email,
      password,
      name,
    })
    .then(response => {
      console.log('account response:', response);
      // createProfile(response.data.data);
    })
    .catch(error => {
      if (error) {
        console.log('❌ Server responded with status:', error);
      }
    });
};

module.exports = {createuserAccount}