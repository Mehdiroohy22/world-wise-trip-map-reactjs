/* eslint-disable react/prop-types */
import { useReducer } from "react";
import { useContext } from "react";

import { createContext } from "react";

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const AutContext = createContext()

const initialState = {
  user: null,
  isAuthenticated: false
}

function reducer(currState, action) {
  switch (action.type) {
    case 'login':
      return { ...currState, user: action.payload, isAuthenticated: true }
    case 'logout':
      return { ...currState, user: null, isAuthenticated: false }
    default:
      throw new Error('out of context')
  }
}

function AutContextProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(reducer, initialState)

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) dispatch({ type: 'login', payload: FAKE_USER })
  }

  function logout() {
    dispatch({ type: 'logout' })
  }
  return <AutContext.Provider value={{
    user, isAuthenticated, login, logout
  }}>{children}</AutContext.Provider>
}

function useAut() {
  const context = useContext(AutContext)
  if (context === undefined) throw new Error('the context used out of its provider!!')
  return context
}

export { AutContextProvider, useAut }