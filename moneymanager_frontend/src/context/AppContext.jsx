import { useState } from "react";
import { AppContext } from "./context";

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const clearUser = () => {
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
