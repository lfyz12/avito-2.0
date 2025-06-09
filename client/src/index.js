import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import UserStore from "./store/UserStore";
import PropertyStore from "./store/PropertyStore";
import ReviewStore from "./store/ReviewStore";
import LikeStore from "./store/LikeStore";
import BookingStore from "./store/BookingStore";
import ChatStore from "./store/ChatStore";
import AgreementStore from "./store/AgreementStore";

const root = ReactDOM.createRoot(document.getElementById('root'));

export const Context = createContext();

root.render(
  <Context.Provider value={{
      userStore: new UserStore(),
      propertyStore: new PropertyStore(),
      reviewStore: new ReviewStore(),
      likeStore: new LikeStore(),
      bookingStore: new BookingStore(),
      chatStore: new ChatStore(),
      agreementStore: new AgreementStore()
  }}>
    <App />
  </Context.Provider>
);


