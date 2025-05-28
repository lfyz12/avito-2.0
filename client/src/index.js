import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import UserStore from "./store/UserStore";
import PropertyStore from "./store/PropertyStore";

const root = ReactDOM.createRoot(document.getElementById('root'));

export const Context = createContext();

root.render(
  <Context.Provider value={{
      userStore: new UserStore(),
      propertyStore: new PropertyStore()
  }}>
    <App />
  </Context.Provider>
);


