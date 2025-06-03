// Header.jsx
import { observer } from "mobx-react-lite";
import {useContext, useState} from "react";
import { useNavigate } from "react-router-dom";
import {CHATROUTER, HOMEROUTER, LOGINROUTER, PROFILEROUTER} from "../utils/consts";
import {Context} from "../index";

const Header = observer(() => {
    const { userStore } = useContext(Context);
    const navigate = useNavigate();
    const [chatsOpen, setChatsOpen] = useState(false);
    // Добавлено состояние для мобильного меню
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await userStore.logout().catch(err => {
            console.log(err)
        });
        navigate(LOGINROUTER);
    };

    const handleLogin = () => {
        navigate(LOGINROUTER);
    };

    // Закрытие мобильного меню при навигации
    const navigateWithClose = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="w-full bg-white border-b border-gray-200 px-4 sm:px-6 py-3 relative">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Логотип */}
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => navigate(HOMEROUTER)}
                >
                    <div className="bg-blue-600 rounded-md w-9 h-9 flex items-center justify-center mr-2">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900 hidden sm:block">Avito</span>
                </div>


                {/* Навигация */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate(CHATROUTER)}
                            className="relative p-2 text-gray-600 hover:text-blue-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                            </svg>

                        </button>
                    </div>
                    {userStore.isAuth ? (
                        <>
                            <button
                                onClick={() => navigate(PROFILEROUTER + '/lk')}
                                className="hidden sm:flex items-center text-gray-700 hover:text-blue-600 transition"
                            >
                                <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                                <span className="font-medium">{userStore.user?.name || "Профиль"}</span>
                            </button>

                            <button
                                onClick={() => userStore.user.role === 'owner' ? navigate(`${PROFILEROUTER}/create`) : navigate(`${PROFILEROUTER}/like`)}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm transition"
                            >
                                {userStore.user.role === 'owner' ?
                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                    </svg> :
                                    <svg
                                        className={`w-5 h-5 text-gray-50 mr-1}`}
                                        fill={'none'}
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                    </svg>}
                                <span
                                    className="hidden sm:block">{userStore.user.role === 'owner' ? 'Подать объявление' : 'Избранное'}</span>
                                <span className="sm:hidden">+</span>
                            </button>

                            <button
                                onClick={handleLogout}
                                className="hidden sm:flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm transition"
                            >
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                </svg>
                                Выйти
                            </button>

                            {/* Исправленная иконка меню для мобильных */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="sm:hidden flex items-center text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M4 6h16M4 12h16M4 18h16"/>
                                </svg>
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleLogin}
                                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm transition"
                            >
                                <svg className="w-5 h-5 mr-1 hidden sm:block" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                                </svg>
                                <span>Войти</span>
                            </button>

                            {/* Исправленная иконка меню для мобильных */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="sm:hidden flex items-center text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M4 6h16M4 12h16M4 18h16"/>
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Мобильное меню */}
            {isMobileMenuOpen && (
                <div className="sm:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50">
                    <div className="flex flex-col py-2">
                        {userStore.isAuth ? (
                            <>
                                <button
                                    onClick={() => navigateWithClose(PROFILEROUTER + '/lk')}
                                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Профиль
                                </button>
                                <button
                                    onClick={() => {
                                        userStore.user.role === 'owner'
                                            ? navigateWithClose(`${PROFILEROUTER}/create`)
                                            : navigateWithClose(`${PROFILEROUTER}/like`);
                                    }}
                                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
                                >
                                    {userStore.user.role === 'owner' ? (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Подать объявление
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            Избранное
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Выйти
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => {
                                    handleLogin();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                Войти
                            </button>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
});

export default Header;