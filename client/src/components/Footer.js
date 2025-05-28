const Footer = () => {
    return (
        <footer className="w-full bg-gray-100 text-gray-600 py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Левая часть */}
                    <div className="text-sm text-center md:text-left">
                        © {new Date().getFullYear()} Avito 2.0. Все права защищены.
                    </div>

                    {/* Правая часть */}
                    <div className="flex flex-wrap gap-4 text-sm justify-center md:justify-end">
                        <a href="#" className="hover:text-blue-600 transition">О нас</a>
                        <a href="#" className="hover:text-blue-600 transition">Контакты</a>
                        <a href="#" className="hover:text-blue-600 transition">Политика конфиденциальности</a>
                        <a href="#" className="hover:text-blue-600 transition">Условия использования</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
