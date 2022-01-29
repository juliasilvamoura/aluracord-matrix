import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import React from 'react';
import { useRouter} from 'next/router';
import appConfig from '../config.json';


function Title(props){
    // console.log(props.children); // imprime o que tem no props que é o argumento dentro de <Title> argumento </Title>
    const Tag = props.tag || 'h1'; // pegando a tag e passando ela, assim posso escolher meu titulo h1, ou h2 e assim por diante
    return(
         /* usa o {} para ele tratar o valor dentro como uma variavel dinamica e não como texto */
        <>
        <Tag>{props.children}</Tag>  

        <style jsx>{`  
        ${Tag} {
        color: ${appConfig.theme.colors.neutrals['000']};
        font-size: 24px;
        font-weight: 600;
      }
    `}</style>
    </> // uma tag fantasma pra não dar erro no style
    );
}

/*
// Componente React
function HomePage() {
    //JSX
    // colocamos parenteses do return pra ele entender que tem que retornar tudo o que está no parenteses
    // Não precisa ficar criando nome de classe, a propria biblioteca do react cria para você
    //Esse stilo só pega nas tags pertos
    return( 
        // o GlobalStyle vai contem todo o CSS genérico
    <div>
        <GlobalStyle></GlobalStyle> 
        <Title tag="h2">Boas vindas de volta!</Title>
        <h2>Discord - Alura Matrix</h2>
        
    </div>

    )
  }

  export default HomePage
  */
  
  export default function PaginaInicial() {
    //const username = 'juliasilvamoura';
    // usando o State do react ele da tanto o valor quando uma função set desse valor
    //const [username, setUsername] = React.useState('');
    const [username, setUsername] = React.useState(''); //use alguma coisa é um gancho para fazer algo no react
    const roteamento = useRouter();
  
    return (
      <>
        <Box
          styleSheet={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: appConfig.theme.colors.primary[500],
            backgroundImage: 'url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)', // imagem de fundo Matrix
            backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
          }}
        >
          <Box
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },
              width: '100%', maxWidth: '700px',
              borderRadius: '5px', padding: '32px', margin: '16px',
              boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
              backgroundColor: appConfig.theme.colors.neutrals[700],
            }}
          >
              
            {/* 
            Formulário - como trabalha dentro de uma tag de formulario a tendencia é dar um refresh na página ao clicar em entrar
            Como se fosse buscar algo no banco 
            */}


            <Box
              as="form"
              onSubmit={function (infosDoEvento){ // esse onSubmit é sempre que tem uma submissão ele faz alguma coisa
                infosDoEvento.preventDefault(); // previne o recarregamento total da página
                //Para mudar de página - vamos para a página do chat
                // FORMA 1 MUDAR DE PAGINA - window.location.href='/chat';
                // next gerencia a parte de roteamento de paginas
                // FORMA 2 MUDAR DE PAGINA usando o NEXT
                roteamento.push (`/chat?username=${username}`); // ? serve para concatenar
                // roteamento.push ('/chat?username='+ username);
              }}
              styleSheet={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
              }}
            >
              <Title tag="h2">Boas vindas de volta!</Title>
              <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
                {appConfig.name}
              </Text>

{/* 
Pra praticar e mostrar o username 
              <input 
              type="text"
              value={username}
              onChange={function (event){
                  //Quer trocar o valor da variavel e deve receber esse valor
                  const valor = event.target.value;
                  //Troca o valor através do react, e altera em 3 lugares diferentes que usa a variavel que está mudando
                  // se atualizar a variavel direto como é uma const ela não irá alterar e dará um erro (ideia do set e get)
                  setUsername(valor);
              }}
              />
              */}

              
              <TextField
              value={username}
              // onChange sempre que tem alguma alteração ele faz uma submissão
              onChange={function (event){
                  const valor = event.target.value;
                  // explicação bloco input
                  setUsername(valor);
                  
              }}

              // Estilo do campo input 
                fullWidth
                textFieldColors={{
                  neutral: {
                    textColor: appConfig.theme.colors.neutrals[200],
                    mainColor: appConfig.theme.colors.neutrals[900],
                    mainColorHighlight: appConfig.theme.colors.primary[500],
                    backgroundColor: appConfig.theme.colors.neutrals[800],
                  },
                }}
              />
            

              <Button
                type='submit'
                label='Entrar'
                fullWidth
                buttonColors={{
                  contrastColor: appConfig.theme.colors.neutrals["000"],
                  mainColor: appConfig.theme.colors.primary[500],
                  mainColorLight: appConfig.theme.colors.primary[400],
                  mainColorStrong: appConfig.theme.colors.primary[600],
                }}
              />
            </Box>
            {/* Formulário */}
  
  
            {/* Photo Area */}
            <Box
              styleSheet={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '200px',
                padding: '16px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                border: '1px solid',
                borderColor: appConfig.theme.colors.neutrals[999],
                borderRadius: '10px',
                flex: 1,
                minHeight: '240px',
              }}
            >
              <Image
                styleSheet={{
                  borderRadius: '50%',
                  marginBottom: '16px',
                }}
                src={`https://github.com/${username}.png`}
              />

              {/* Text do nome que aparece abaixo da foto */}
              <Text
                variant="body4"
                styleSheet={{
                  color: appConfig.theme.colors.neutrals[200],
                  backgroundColor: appConfig.theme.colors.neutrals[900],
                  padding: '3px 10px',
                  borderRadius: '1000px'
                }}
              >
                {username}
              </Text>
            </Box>
            {/* Photo Area */}
          </Box>
        </Box>
      </>
    );
  }