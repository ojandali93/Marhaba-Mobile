const usernameUpdate = (data: string) => {
  return data.toLowerCase();
}

const passwordUpdate = (data: string): boolean => {
    const hasMinLength = data.length >= 8;
    const hasUppercase = /[A-Z]/.test(data);
    const hasNumber = /\d/.test(data);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(data);
    return hasMinLength && hasUppercase && hasNumber && hasSpecialChar;
};

const verifyUpdate = (data: string, password: string): boolean => {
  return data === password;
};

module.exports = {usernameUpdate, passwordUpdate, verifyUpdate};
