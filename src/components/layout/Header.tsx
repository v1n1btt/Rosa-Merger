export default function Header() {
    return (
        <header className="header">
            <a href="/" className="logo">
                Rosa Merger
            </a>

            <nav className="navigation">
            <a href="#inicio">Início</a>
            <a href="#colecao">Coleção</a>
            <a href="#sobre">Sobre</a>
            </nav>

            <a href="#colecao" className="header-button">
                Ver coleção
            </a>
        </header>
    )
}