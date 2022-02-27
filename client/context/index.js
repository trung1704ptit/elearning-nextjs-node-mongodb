import { useReducer, createContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { routes, types } from "../utils/constants";

const initialState = {
  user: null,
};

const Context = createContext();

const rootReducer = (state, action) => {
  switch (action.type) {
    case types.LOGIN:
      return {
        ...state,
        user: action.payload,
      };
    case types.LOGOUT:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

// context provider
const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const router = useRouter();

  useEffect(() => {
    dispatch({
      type: "LOGIN",
      payload: JSON.parse(window.localStorage.getItem("user")),
    });
  }, []);

  axios.interceptors.response.use(
    function (response) {
      // any status code that lie within the range 2xx cause this function
      // to trigger
      return response;
    },
    function (error) {
      // any status code that falls outside the range of 2xx cause function
      // to trigger
      let res = error.response;
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
          axios
            .get("/api/logout")
            .then((data) => {
              console.log("/401 error > logout");
              dispatch({ type: types.LOGOUT });
              window.localStorage.remove("user");
              router.push(routes.LOGIN);
            })
            .catch((err) => {
              console.log("Interceptors error: ", err);
            });
        });
      }

      return Promise.reject(error);
    }
  );


  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get('/api/csrf-token');
      axios.defaults.headers["X-CSRF-Token"] = data.csrfToken;
    }
    getCsrfToken();
  }, [])

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export { Context, Provider };
