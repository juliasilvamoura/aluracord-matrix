/* CRIANDO UMA PÁGINA NOVA
export default function PaginaDoChat (){
    return (
        <div>Página do Chat</div>
    )
}
*/
// O style global não pega aqui, logo vamos usar a ideia de custom App para criar o Style de forma global que encapsula todas as páginas do projeto

import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useRouter} from 'next/router';
import { createClient } from '@supabase/supabase-js';
import {ButtonSendSticker} from '../src/components/ButtonSendSticker';

// Como fazer AJAX: https://medium.com/@omariosouto/entendendo-como-fazer-ajax-com-a-fetchapi-977ff20da3c6

// o SUPABSE FAZ O PAPEL DE FAZER A CHAMADA NO BANCO DE DADOS - COMO UMA API
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM5MTA1NiwiZXhwIjoxOTU4OTY3MDU2fQ.5yFRse47-6OFOZbjX1vHxsmZW0OB_99BLwrWNlJPpvA';
const SUPABASE_URL = 'https://ftdmkvqlqhkwaoxyoniv.supabase.co';

// Create a single supabase client for interacting with your database
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fazendo usando Fetch
/* peguei em redes e cabeçalhos no inspecionar do navegador

    fetch(`${SUPABASE_URL}/rest/v1/mensagens?select=*`,{
        headers: {
            'content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': 'Bearer' + SUPABASE_ANON_KEY
        }
    })
        .then((res) => {`
            return res.json();

    })
    .then((response) => {
        console.log(response);
    });

*/
function escutaMensagensEmTempoReal(adicionaMensagem) {
    return supabaseClient
      .from('mensagens')
      .on('INSERT', (respostaLive) => {
        adicionaMensagem(respostaLive.new);
      })
      .subscribe();
  }

export default function ChatPage() {
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
    //const [username, setUsername] = React.useState('');
    // A listaDeMensagens é só para ver fazer listaDeMensagens.push(mensagem) não vai alterar ela e nem acontecer nada

    /**
     * Usuário digita no campo textarea
     * Aperta enter pra enviar
     * Tem que adicionar o texto na Listagem
     * 
     * DEV
     * [x] Campo criado
     * [] Vamos usar o onChange e o useState (ter if para caso seja enter pra limpar a variavel)
     * [] Lista de mensagens
     */

    React.useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', {ascending: false}) // inverte a ordem das mensagens
            .then(({data}) => {
                //console.log('dados da consulta', data)
                setListaDeMensagens(data); // ao invés de pegar dados e pegar o data no then da pra pegar direto
            });

            const subscription = escutaMensagensEmTempoReal((novaMensagem) => {
                //console.log('Nova mensagem:', novaMensagem);
                //console.log('listaDeMensagens:', listaDeMensagens);

                // Quero reusar um valor de referencia (objeto/array) 
                // Passar uma função pro setState
          
                // setListaDeMensagens([
                //     novaMensagem,
                //     ...listaDeMensagens
                // ])
                setListaDeMensagens((valorAtualDaLista) => {
                  return [
                    novaMensagem,
                    ...valorAtualDaLista,
                  ]
                });
              });
          
              return () => {
                subscription.unsubscribe();
              }

    }, []); //colocando listaDeMensages assim não vai ficar chamando o servidor a cada palavra, mas sim quando a lista de mensagem mudar
    // ou seja, quando uma mensagem nova chegar, para isso usamos o useEffect 
    // Depois tiramos listaDeMensagens do [] pq tem o setListaDeMensagens



    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            // id: listaDeMensagens.length + 1, tirou o id pq vamos pegar o que vem do servidor
            de: usuarioLogado,
            texto: novaMensagem,
        }

        supabaseClient
            .from('mensagens')
            .insert([
                // Tem que ser um objeto com os MESO CAMPOS que você escreveu no supabase
                mensagem
            ])
            .then(({data}) => {
                console.log('criando mensagem',data)
                /*  setListaDeMensagens([
                    data[0],
                    ...listaDeMensagens,
        
                ]); */
            }); 

        setMensagem('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList mensagens={listaDeMensagens} />


                    {/* {listaDeMensagens.map((mensagemAtual) => {
                        return(
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de} : {mensagemAtual.texto}
                            </li>
                        )
                    })} */}


                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key == 'Enter') {
                                    event.preventDefault(); // ele impede a quebra de linha que é o comum no enter
                                    // função separada para salvar a mensagem 
                                    handleNovaMensagem(mensagem);
                                }
                            }}

                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        {/* CallBack */}
                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                handleNovaMensagem(':sticker: ' + sticker);
                            }}
                            />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    //console.log(props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >

            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {/*Condicional: {mensagem.texto.startsWith(':sticker:').toString()} */} 
                        {mensagem.texto.startsWith(':sticker:') // usa o ternário, para retornar algo para o componente visual
                        ? (
                            <Image src={mensagem.texto.replace(':sticker:', '')}/> 
                        )
                        : (
                            mensagem.texto
                        )}

                        {/*{mensagem.texto}*/}
                    </Text>
                );
            })}
        </Box>
    )
}