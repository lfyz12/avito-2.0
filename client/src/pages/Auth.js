import React, {useContext, useEffect, useState} from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {HOMEROUTER, LOGINROUTER, REGISTERROUTER} from "../utils/consts";
import { observer } from "mobx-react-lite";
import {Context} from "../index";
import InputMask from 'react-input-mask';

const Auth = observer(() => {
    const { userStore } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(false);
    const [role, setRole] = useState('client');
    const [roleActive, setRoleActive] = useState(true)
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');

    const checkIsLogin = () =>
        location.pathname === LOGINROUTER ? setIsLogin(true) : setIsLogin(false);

    useEffect(() => {
        checkIsLogin();
        userStore.setError('')
    }, [location.pathname]);

    const handleSubmit = async () => {
        if (isLogin) {
            await userStore.login(email, password)
                .then(res => navigate(HOMEROUTER))
                .catch(() => userStore.setError('Неверные логин или пароль'));
        } else {
            if (!name || !password || !email || !role) {
                userStore.setError('Заполнены не все поля');
                return;
            }

            await userStore.registration(email, password, name, role, phone)
                .then(res => navigate(HOMEROUTER))
                .catch(() => userStore.setError('Ошибка регистрации'));
        }
    };

    return (
        <div className={`auth h-[85vh] w-full max-w-[500px] mx-auto py-8 px-4 ${isLogin ? 'min-h-[60vh]' : 'min-h-[80vh]'} flex flex-col items-center`}>
            <div className="w-full mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-1 text-center">
                    {isLogin ? "Вход в аккаунт" : "Регистрация"}
                </h1>
                <p className="text-gray-500 text-center">
                    {isLogin ? "Введите свои данные" : "Создайте новый аккаунт"}
                </p>
            </div>

            <div className="w-full m-auto bg-white rounded-xl shadow-sm p-6 sm:p-8 border border-gray-100">
                <div className="space-y-4 mb-6">
                    {isLogin ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Эл. почта</label>
                                <input
                                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                    placeholder="example@mail.ru"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Пароль</label>
                                </div>
                                <input
                                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ФИО</label>
                                <input
                                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                    placeholder="Иванов Иван Иванович"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Эл. почта</label>
                                <input
                                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                    placeholder="example@mail.ru"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                                <input
                                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                    placeholder="example@mail.ru"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Вы
                                    клиент/арендодатель</label>
                                <div className='w-full flex gap-2'>
                                    <button
                                        className={`${roleActive ? 'border-blue-600 border-2' : 'border-black'} active:bg-gray-200 border w-full h-12 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition duration-200 flex items-center justify-center`}
                                        onClick={() => {
                                            setRoleActive(true)
                                            setRole('client')
                                        }}>
                                        Клиент
                                    </button>
                                    <button
                                        className={`${!roleActive ? 'border-blue-600' : 'border-black'} active:bg-gray-200 border w-full h-12 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition duration-200 flex items-center justify-center`}
                                        onClick={() => {
                                            setRoleActive(false)
                                            setRole('owner')
                                        }}>
                                        Арендодатель
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                                <input
                                    className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full h-12 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition duration-200 flex items-center justify-center"
                >
                    {isLogin ? "Войти" : "Создать аккаунт"}
                </button>

                {userStore.error && (
                    <p className='text-center text-red-600 font-medium mt-4 py-2 px-3 bg-red-50 rounded-lg'>
                    {userStore.error}
                    </p>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200 text-center text-gray-600">
                    {isLogin ? (
                        <span>
                            Ещё нет аккаунта?{" "}
                            <NavLink
                                to={REGISTERROUTER}
                                className="text-blue-600 font-medium hover:text-blue-800 hover:underline"
                            >
                                Зарегистрироваться
                            </NavLink>
                        </span>
                    ) : (
                        <span>
                            Уже есть аккаунт?{" "}
                            <NavLink
                                to={LOGINROUTER}
                                className="text-blue-600 font-medium hover:text-blue-800 hover:underline"
                            >
                                Войти
                            </NavLink>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
});

export default Auth;