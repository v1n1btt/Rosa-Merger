import CartIndicator from "../cart/CartIndicator"
import AuthMenu from "../auth/AuthMenu"

export default function Header() {
    return (
        <header className="header">
            <a href="/" className="logo">
                Rosa Merger
            </a>

            <nav className="navigation">
            <a href="/">Início</a>
            <a href="/colecao">Coleção</a>
            <a href="/#sobre">Sobre</a>
            </nav>

            <div className="header-actions">
                <AuthMenu />
                <CartIndicator />
            </div>
        </header>
    );
}