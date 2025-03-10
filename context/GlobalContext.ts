import React, { createContext, useContext, useEffect, useState } from "react";

export type User = {
  name: string;
};
type GlobalContextType = {
  isLogged: boolean;
  setIsLogged: (arg: boolean) => void;
  user: User | null;
  setUser: (arg: User | null) => void;
  loading: boolean;
};

export const GlobalContext = createContext<GlobalContextType>({
  isLogged: false,
  setIsLogged: () => {},
  user: null,
  setUser: () => {},
  loading: false,
});
export const useGlobalContext = () => useContext(GlobalContext);
