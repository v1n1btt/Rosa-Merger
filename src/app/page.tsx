import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
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

      <section id="inicio" className="hero">
        <div className="hero-content">
          <span className="eyebrow">FEITO À MÃO, COM CARINHO</span>

          <h1>
            A beleza está
            <br />
            nos <em>detalhes.</em>
          </h1>

          <p>
            Bolsas artesanais em crochê, feitas com cuidado,
            personalidade e atenção a cada detalhe.
          </p>

          <a href="#colecao" className="hero-button">
            Conheça a coleção
          </a>
        </div>

        <div className="hero-image">
          <span>Artesanal por essência.</span>
        </div>
      </section>

      <section id="colecao" className="collection">
        <span className="eyebrow">NOSSA SELEÇÃO</span>
        <h2>Peças feitas para encantar</h2>
        <p>
          Cada bolsa carrega um pouco da dedicação e do cuidado
          presentes no trabalho artesanal.
        </p>
      </section>

      <section id="sobre" className="about">
        <div className="about-image">
          <span>O cuidado está em cada ponto.</span>
        </div>

        <div className="about-content">
          <span className="eyebrow">UM POUCO DA MINHA HISTÓRIA</span>

          <h2>
            Cada peça tem
            <em> um toque especial.</em>
          </h2>

          <p>
            Tudo começou com o carinho pelo trabalho artesanal e a
            paixão por transformar fios em peças únicas.
          </p>

          <p>
            Cada bolsa é confeccionada à mão, com dedicação e atenção
            aos detalhes, respeitando o tempo e a delicadeza de cada criação.
          </p>

          <p>
            Quero criar peças que acompanhem momentos especiais e
            expressem a personalidade de quem as usa.
          </p>

          <a href="#colecao" className="about-button">
            Conheça minhas criações
          </a>
        </div>
      </section>
    </main>
  );
}
