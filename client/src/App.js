import './App.css';
import AppRouter from "./components/AppRouter";
import {BrowserRouter} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {useContext, useEffect} from "react";
import {Context} from "./index";
import { socket } from './utils/socket';

function App() {
    const { userStore } = useContext(Context);



    useEffect(() => {
        const checkAuth = async () => {
            try {
                await userStore.refresh()
            } catch (error) {
                console.log('Пользователь не авторизован');
            }
        };


        if (localStorage.getItem('accessToken')) {
            checkAuth();
        } else {
            userStore.setAuth(false);
        }
    }, [userStore]);

    if (userStore.isLoading) {
        return <div>Загрузка...</div>;
    }
  return (
    <BrowserRouter>
        <Header/>
      <AppRouter/>
        <Footer/>
    </BrowserRouter>
  );
}

export default App;
