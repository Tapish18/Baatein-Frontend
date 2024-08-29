export const getToken = function () {
  return localStorage.getItem("token");
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
  return;
};

export const removeToken = () => {
  localStorage.removeItem("token");
  return;
};

export const getAuthHeader = () => {
  let token;
  token = getToken();
  return {
    "Content-Type": "application/JSON",
    ...(token ? { authorization: "Bearer " + token } : {}),
  };
};

export const getTimeOrDate = function (dateString) {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const options = { month: "short", day: "2-digit", year: "numeric" };
  const optionsUsed = { month: "short", day: "2-digit" };

  const currDateWithoutOffset = new Date();
  const currDate = new Date(currDateWithoutOffset.getTime() + istOffset);

  const dbDateWithoutOffset = new Date(dateString);
  const dbDate = new Date(dbDateWithoutOffset.getTime() + istOffset);

  if (
    currDate.toLocaleDateString("en-US", options) ===
    dbDate.toLocaleDateString("en-US", options)
  ) {
    return `${dbDate.getUTCHours()}:${dbDate.getUTCMinutes()}`;
  } else {
    return dbDate.toLocaleDateString("en-US", optionsUsed);
  }
};

export const getTwentyLettersOrLess = (s) => {
  if (s.length <= 25) {
    return s;
  } else {
    return s.slice(0, 24) + ".....";
  }
};
