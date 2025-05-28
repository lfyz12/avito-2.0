import React, {useContext, useEffect, useState} from 'react';
import {Route, Routes, useLocation} from "react-router-dom";
import Home from "../pages/Home";
import {observer} from "mobx-react-lite";
import {authRoutes, publicRoutes} from "../routes";
import {Context} from "../index";

const AppRouter = () => {
    const {userStore} = useContext(Context)
    const location = useLocation()
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }, [location.pathname])

    return (
        <Routes>
            {publicRoutes.map(({path, element}) => <Route key={path} path={path} element={element} />)}
            {userStore.isAuth && authRoutes.map(({path, element}) => <Route key={path} path={path} element={element} />)}
            <Route path='*' element={<Home/>} />
        </Routes>
    );
};

export default observer(AppRouter);