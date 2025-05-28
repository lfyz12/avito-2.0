import './App.css';
import AppRouter from "./components/AppRouter";
import {BrowserRouter} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {useContext, useEffect} from "react";
import {Context} from "./index";

function App() {
    const { userStore } = useContext(Context);

    useEffect(() => {
        userStore.refresh(); // Проверка авторизации
    }, [userStore]);

    if (userStore.isLoading) {
        return <div>Загрузка...</div>; // Показать индикатор загрузки
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
