import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {Context} from "../index";

const Header = observer(() => {
    const { userStore } = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await userStore.logout();
        navigate("/login");
    };

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <header className="w-full bg-white shadow-md px-4 md:px-8 py-4 flex justify-between items-center">
            {/* Логотип */}
            <div
                className="text-2xl font-bold text-blue-600 cursor-pointer"
                onClick={() => navigate("/")}
            >
                Avito 2.0
            </div>

            {/* Навигация */}
            <div className="flex items-center gap-4">
                {userStore.isAuth ? (
                    <>
                        <div
                            onClick={() => navigate("/profile")}
                            className="cursor-pointer font-medium text-gray-700 hover:text-blue-600"
                        >
                            {userStore.user?.name || "Профиль"}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
                        >
                            Выйти
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleLogin}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition"
                    >
                        Войти
                    </button>
                )}
            </div>
        </header>
    );
});

export default Header;
