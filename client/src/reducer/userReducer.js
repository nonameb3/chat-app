export const initialState = {
  userName: "",
  isLoggedIn: "",
};

export default function (state, action) {
  switch (action.type) {
    case "setIsLoggedIn":
      return { ...state, isLoggedIn: action.payload };
    case "setUserName":
      return { ...state, userName: action.payload };
    default:
      return state;
  }
}

export const setUser = (value) => {
  return { type: "setUserName", payload: value };
};

export const setIsLoggedIn = (value) => {
  return { type: "setIsLoggedIn", payload: value };
};
