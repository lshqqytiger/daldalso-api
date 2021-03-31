import Axios from "axios";

const URL: string = "https://sorry.daldalso.com/java/users";

const getJavaUsers = async () => {
  let result = await Axios.get(URL);

  if (!result) return;
  else {
    return result.data.users.length;
  }
};

const getJavaUserList = async () => {
  let result = await Axios.get(URL);

  if (!result) return;
  else {
    return result.data.users;
  }
};

export { getJavaUsers, getJavaUserList };
