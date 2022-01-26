// Não é uma página 
// É o estilo global de todas as páginas do projeto
// Tudo o que por aqui vai para todas as paginas



function GlobalStyle() {
    // O * diz que queremos tudo
    // o App fit Height resolve só com CSS o BO da tela não ficar 100%, ajuste de altura
    return (
        <style global jsx>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
      }
      body {
        font-family: 'Open Sans', sans-serif, Arial;
      }
      /* App fit Height */ 
      html, body, #__next {
        min-height: 100vh;
        display: flex;
        flex: 1;
      }
      #__next {
        flex: 1;
      }
      #__next > * {
        flex: 1;
      }
      /* ./App fit Height */ 
    `}</style>

    );
}

export default function CustomApp({ Component, pageProps }) {
    return (
        <>
            <GlobalStyle />
            <Component {...pageProps} />
        </>
    );

}