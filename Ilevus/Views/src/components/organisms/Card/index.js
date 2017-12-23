import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ifProp } from 'styled-tools'
import { palette, size } from 'styled-theme'
// import Sticky from 'react-sticky-state';
import Progress from 'react-progressbar';

import { StickyContainer, Sticky } from 'react-sticky';

import iconMessage from '../../../../images/message.svg'
import iconcheck from '../../../../images/check.svg'
import starGreen from '../../../../images/star_green.svg'
import starWhite from '../../../../images/star_white.svg'
import video from '../../../../images/video.svg'
import artigo from '../../../../images/artigo.svg'
import recurso_complementar from '../../../../images/recurso_complementar.svg'
import acesso_total from '../../../../images/acesso_total.svg'
import dispositivos_modeis from '../../../../images/dispositivos_moveis.svg'
import certificado_conclusao from '../../../../images/certificado_conclusao.svg'
import pessoa from '../../../../images/pessoa.svg'
import heart from '../../../../images/heart.svg'
import marker from '../../../../images/marker.svg'
import star_black from '../../../../images/star_black.svg'

import user from '../../../../images/user.svg'
import message_black from '../../../../images/message_black.svg'


import {
  Block,
  Paragraph,
  IconLink,
  IconButton,
  Button,
  LogoImage,
  Label,
  PreformattedText,
  Heading,
  Tooltip,
  List,
  Link,
  HorizontalRule

} from 'components'

const Wrapper = styled(Block) `
  display: flex;
  // position:relative;
   padding-left: 4rem;
  box-sizing: border-box;
  color:#fff;
  height:280px;
  @media screen and (max-width: 640px) {
     padding-left: 0.25rem;
     padding-right: 0.025rem;
  },
  '&::after': {
    content: " "; /* 1 */
    display: table; /* 2 */
    clear: both;
  }
`
const DivRight = styled.div`
float:right;
padding-right:10px;
`

const CardBlack = styled.div`
// display:none;
padding-bottom:50px;
*zoom: 1;
'&::after': {
  clear: both;
}
'&::before .after': {
  content: " "; /* 1 */
  display: table; /* 2 */
}

`
const InnerWrapper = styled.div`
  display: flex;
  width: 100%;
  
  max-width: ${size('maxWidth')};
  @media screen and (max-width: 400px) {
    flex-wrap: wrap;
  }
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  //padding: 1rem;
  padding-left: 2rem;
  color:#fff;
  box-sizing: border-box;
  width:100%;
  &:first-child {
    flex: none;
  }
  @media screen and (max-width: 640px) {
    padding: 0.025rem;
    width: 90%;
  }
`


const SectionCardFloat = styled.section`
// display: flex;
flex-direction: column;
align-items: center;
//padding: 1rem;
padding-left: 2rem;
color:#fff;
box-sizing: border-box;
width: 300px;
background-color:#fff;
border-radius:3px;

box-shadow: 0 2px 8px 2px rgba(20,23,28,.15);
`



const Text = styled(Paragraph) `
  
  font-weight: 300;
  font-size: 1.35rem;
  line-height: 1.35em;
  width: 100%;
  letter-spacing: 0.05em;
  color:#fff;

  @media screen and (max-width: 640px) {
    // text-align: center;
    font-size: 1rem;
  }
`

const TextMiniCard = styled.div`

font-weight: 200;
font-size: 1.35rem;
line-height: 1.35em;
width: 100%;
letter-spacing: 0.05em;
color:#fff;

@media screen and (max-width: 640px) {
  // text-align: center;
  font-size: 1rem;
}
`

const CardGroup = styled.div`
  margin-top: 2rem;
  display: flex;
  position:relative;
  background-color:#fff;
  border: 1 solid black;
 // padding-left:3em;
  width:300px;
  height:450px;
  > :not(:first-child) {
    // margin-left: 0.5rem;
  }
`

const ListGroup = styled.div`
margin-top: 600px;
// display: flex;
position:relative;
background-color:#f2f2f2;
border: 1 solid black;
width:850px;
height:260px;
padding-left:2rem;

`

const CardText = styled.div`
margin-top: 2rem;
position:relative;
width:100%;
// height:800px;
// padding-left:2rem;

`


const CardTextContent = styled.div`
position:relative;
width:800px;
height:200px;
// padding-left:2rem;
border-bottom: 1px solid #efefef;
border-top: 1px solid #efefef;
diaplay:none;

`
const ItemImagem = styled.div`
margin-top: 2rem;
position:relative;
width:200px;
height:80px;
// padding-left:2rem;
float:left;
`

const ItemTitulo = styled.div`
margin-top: 2rem;
position:relative;
width:280px;
height:80px;
padding-left:1rem;
float:left;
`

const ItemPontos = styled.div`
margin-top: 2rem;
position:relative;
width:60px;
height:80px;
padding-left:1rem;
float:left;
margin-top:70px;
`
const ItemViews = styled.div`
margin-top: 2rem;
position:relative;
width:60px;
height:80px;
padding-left:1rem;
float:left;
margin-top:70px;
`
const ItemPrice = styled.div`
position:relative;
width:120px;
height:80px;
padding-left:1rem;
float:left;
margin-top:60px;
`

const TextList = styled(Paragraph) `

font-weight: 400;
font-size: 0.55rem;
line-height: 0.35em;
width: 100%;
letter-spacing: 0.05em;
color:#fff;
margin:0px;

@media screen and (max-width: 640px) {
  // text-align: center;
  font-size: 1rem;
}
`

const Mapa = styled.div`
width:1000px;
height:600px;
frameborder:0;
border:0;
`

const CardMapa = styled.div`
margin-top: 2rem;
position:relative;
width:520px;
height:400px;
// padding-left:2rem;
float:left;
`
const CardMapaCidade = styled.div`
position:relative;
width:150px;
height:30px;
padding-left:1rem;
float:left;
margin-top:70px;
`



const CardUser = styled.div`
margin-top: 2rem;
position:relative;
width:250px;
height:400px;
// padding-left:2rem;
float:left;
`


const CardUserCidade = styled.div`
position:relative;
width:450px;
height:30px;
padding-left:1rem;
float:left;
margin-top:70px;
`

const ItemAval = styled.div`
margin-top: 4rem;
position:relative;
width:50px;
height:80px;
float:left;
margin-right:1rem;
`


const ItemAvalPes = styled.div`
margin-top: 3rem;
position:relative;
width:180px;
height:80px;
float:left;
margin-right:1rem;
`


const ItemAvalText = styled.div`
margin-top: 2rem;
position:relative;
width:400px;
height:80px;
padding-left:1rem;
float:left;
`



const CardMini = styled.div`
margin-top: 2rem;
// display: flex;
position:relative;
background-color:#f2f2f2;
border: 1 solid black;
width:710px;
 height:400px;
// padding-left:2rem;
padding: 15px 10px 0 15px;

`
const CardMiniContent = styled.div`
position:relative;
width:210px;
height:290px;
float:left;
// padding-left:10px;
background-color:#fff;
// padding-left:2rem;
border: 1px solid #efefef;
margin-left:10px;

box-shadow: 0 2px 8px 2px rgba(20,23,28,.15);

`



const DivFloat = styled.div`
position: -webkit-sticky;
position: sticky;
top: 200px;
margin-top:109px;
padding-left:70%;

`

const DivMenuFloat = styled.div`
position: fixed;
 right:0%;
top:0%;
width: 100%;
margin-top: -2.5em;
z-index:2;
@media screen and (max-width: 800px) {
  right:1%;
  
}
`



const MenuFloat = styled.div`
  background-color:#212121;
  margin-top: 2.5em;
  padding-left:50px;
  opacity: 0.8;
`
const Star = styled.div`
right:25%;
top:10%;
width: 8em;
margin-top: -2.5em;
icon:'../../../../images/star.svg'
`



const styles = {
  buttonStyleGreen: {
    backgroundColor: "#2CBC4D",
    width: "15em",
    margingBottom: "1em",
  },
  buttonStyleTransparent: {
    backgroundColor: "transparent",
    color: "#2CBC4D",
    width: "15em",
    top: "1em"
  },
  buttonStyleTransparentBold: {
    backgroundColor: "transparent",
    color: "#00aa38",
    width: "15em",
    top: "2em"
  },
  divCard: {
    border: "0.0625em solid #e7e7e7",
    marginTop: "5px"
  },
  labelSmall: {
    fontSize: "9"
  },
  labelListItem: {
    fontSize: "12"
  },
  labelListItemBlack: {
    fontSize: "10",
    fontWeight: "bold"
  },
  labelGreen: {
    color: "#2CBC4D",
  },
  labelGreenDesconto: {
    color: "#2CBC4D",
    textDecorationStyle: "dashed",
    fontWeight: "dashed",
    textDecoration: "line-through"
  },
  labelGreenText: {
    color: "#2CBC4D",
    display: "block",
  },
  labelBold: {
    textDecoration: "bold",
    fontWeight: "bold",
    fontSize: "40",

  },
  labelList: {
    fontSize: "14",
    position: "relative",
    display: "table",
    paddingBottom: "20px"
    // top:"80px"
  },
  labelListStar: {
    fontSize: "14",
    position: "relative",
    display: "table",
    paddingLeft: "10px"
    // paddingBottom:"20px"
    // top:"80px"
  },
  List: {
    // position:"absolute",
    width: "650px",
    // display:"block",
  },
  ListItens: {
    //position:"absolute",
    width: "400px",
    float: "left",
    marginLeft: "0",
    display: "block",
    paddingBottom: "10rem"
  },
  labelBoldList: {
    textDecoration: "bold",
    fontWeight: "bold",
    fontSize: "40",
    display: "block",
  },
  itensOutrosProdutosB: {
    fontWeight: "bold",
    fontSize: "16",
    display: "block",
  },
  itensImage: {
    width: "210px",
    // display:"block",
  },
  itensOutrosMini: {
    fontSize: "15",
    paddingLeft: "60px"
  },
  labelItemBold: {
    color: "#2CBC4D",
    fontSize: "25",
    fontWeight: "bold"
  },
  imageRound: {
    borderRadius: "50%",
    width: "120",
    height: "120"
  },
  labelFeedbackGde: {
    fontSize: "65",
    fontWeight: "bold",
    display: "block",
    lineHeight: "1em"
  },
  labelFeedbackStar: {
    fontSize: "15",
    display: "block",
  },
  labelFeedbackAv: {
    fontSize: "15",
    display: "block",
  },
  textCenter: {
    textAlign: "center"
  },
  itensAvaliacaoCircle: {
    border: "0.0625em solid #000",
    padding: "1em",
    borderRadius: "50%",
    marginTop: "2em"
  },
  itensAvaliacaoMonth: {
    display: "block",
    fontSize: "12",
    color: "#a5a4a4",

  },
  itensAvaliacaoName: {
    display: "block",
    fontSize: "15",
  },
  itensAvaliacaoDenun: {
    display: "block",
    fontSize: "12",
  },
  buttonMais: {
    // backgroundColor: "#fff",
    color: "2CBC4D",

    borderColor: "2CBC4D",
    width: "13em",
    margingBottom: "1em",
  },
  itenValor: {
    fontSize: "50",
    fontWeight: "bold",
    lineHeight: "1em"
  },
  iconWhite: {
    width: "17",
    paddingRight: "5",
    marginTop: "-10",

  },
  iconGreen: {
    width: "17",
    paddingRight: "5",
    marginTop: "-10",
    position: "relative",
    top: "0",
    display: "table-cell"
  },
  starGreen: {
    width: "15",
    paddingRight: "5",
    marginTop: "-10",
    position: "relative",
    top: "0",
    display: "table-cell"
  },
  miniIcon: {
    width: "12",
  },
  starGreenMini: {
    width: "15",
    paddingRight: "5",
    marginTop: "-10",
    position: "relative",
    top: "0",
    display: "table-cell"
  },
  progressBar: {
    fontWeight: "bold",
    // fontSize:"30",
    display: "block",
    paddingBottom: "10",
    // height:"30px"
  },
  Progress: {
    // height:"50px",
  },
  progressbarProgress: {
    // height:"50px !important"
  },
  CardlabelMiniBold: {
    fontSize: "14px",
    fontWeight: "bold",
    display: "flex",
    lineHeight: "22px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "normal",
    fontWeight: "600",
    height: "36px",
    minHeight: "42px",
    fontSize: "15px",
    color: "#29303b",
    marginBottom: "10px",
    paddingLeft: "10px"

  },
  CardMiniTextContent: {
    paddingTop: "-10px"
  },
  CardlabelMini: {
    fontSize: "11px",
    marginLeft: "10px"
  },
  sticky: {
    top: "0",
    position: "fixed"
  },
  labelItemNormal: {
    textDecoration: "line-through"
  }
}


const Card = ({ ...props }) => {
  return (

    <Wrapper opaque reverse {...props}>
      <InnerWrapper>
   
      <Section>
      <StickyContainer>
     
            <CardBlack>
              <Text>
                <Heading level={1} reverse>Como Resolver Problemas Complexos e Tomar Decisões Efetivas</Heading>
                <Heading level={2} reverse> Saiba analisar um problema complexo estruturar seus pensamentos de maneira lógica e tomar a melhor decisão possível</Heading>
              </Text>
              <Text>

                <Label reverse>
                  <div className="ilv-rating-list">
                    <img alt="star" src={starGreen} style={styles.iconWhite} />
                    <img alt="star" src={starGreen} style={styles.iconWhite} />
                    <img alt="star" src={starGreen} style={styles.iconWhite} />
                    <img alt="star" src={starGreen} style={styles.iconWhite} />
                    <img alt="star" src={starWhite} style={styles.iconWhite} />
                    <a>4.1(32 classificações)</a>
                    185 processos concluídos
              </div>
                </Label>
                <Label reverse></Label>
              </Text>
              <Text>
                <Label reverse>Criado por Kleber Donady</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <img alt="conversation" src={iconMessage} style={styles.iconWhite} />
                <Label reverse>Portugues</Label>
              </Text>
              <Text>
              </Text>
            </CardBlack>
          

           
            <ListGroup style={styles.divCard}>
              <Text style={styles.List}>
                <Label style={styles.labelBoldList}>Principais pontos</Label>
              </Text>
              <Text style={styles.ListItens}>
                <Label style={styles.labelList}><img alt="Check" src={iconcheck} style={styles.iconGreen} /> Analisar os problemas de outras maneiras, descobrindo novas oportuniadades. </Label>
                <Label style={styles.labelList}><img alt="Check" src={iconcheck} style={styles.iconGreen} /> Pensar de maneira lógica e sequencial. </Label>
              </Text>
              <Text style={styles.ListItens}>
                <Label style={styles.labelList}><img alt="Check" src={iconcheck} style={styles.iconGreen} /> Conhecerá ferramentas utilizadas por empresas referencia de mercado para resolução de problemas </Label>
                <Label style={styles.labelList}><img alt="Check" src={iconcheck} style={styles.iconGreen} /> Tomar desizões mais efetivas. </Label>
              </Text>
            </ListGroup>
            <CardText>
              <Heading level={1}>Descrição</Heading>
              <Paragraph>
                Nisi eu eiusmod cupidatat aute laboris commodo excepteur esse dolore incididunt incididunt aliquip pariatur est minim officia sit. Nulla pariatur duis duis quis commodo cupidatat voluptate enim culpa elit adipisicing do cupidatat sint anim. Cillum elit magna occaecat proident sit cupidatat ad quis sunt id culpa culpa. Ad duis nulla in incididunt amet consequat officia ad voluptate voluptate. Pariatur eiusmod ullamco cupidatat non magna officia aute magna deserunt qui aute dolor eu. Qui amet non ex cillum sunt ad velit consequat ipsum velit.
              </Paragraph>
            </CardText>
            <CardText>
              <Heading level={1}>Quem é o público alvo</Heading>
              <List>
                <li>Qualquer pessoa que tenha vontade de entender mais sobre resolver problemas e tomar decisões</li>
              </List>
            </CardText>
            <CardText>
              <Heading level={1}>Comparar com outros cursos</Heading>
              <List>
                <CardTextContent>
                  <ItemImagem>
                    <img src="https://reactjs.org/logo-og.png" style={styles.itensImage} />
                    <Label style={styles.itensOutrosMini} >1 hora</Label>
                  </ItemImagem>
                  <ItemTitulo>
                    <Label style={styles.itensOutrosProdutosB}>Como Resolver Problemas Complexos e Tomar desisões Efetivas</Label>
                    <Label >Atualizado em 30/11/2017</Label>
                  </ItemTitulo>
                  <ItemPontos>
                    <Label> <img alt="star" src={starGreen} style={styles.miniIcon} /> 4.1</Label>
                  </ItemPontos>
                  <ItemViews>
                    <img alt="star" src={pessoa} style={styles.miniIcon} />
                    <Label> 185</Label>
                  </ItemViews>
                  <ItemPrice>
                    <Label style={styles.labelItemNormal}> R$20</Label>
                    <Label style={styles.labelItemBold}> R$20</Label>
                  </ItemPrice>
                </CardTextContent>
              </List>
            </CardText>
            <CardText>
              <Link href="">+ Ver mais</Link>
            </CardText>
            <CardText>
              <CardMapa>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7501.343771187411!2d-43.935295999999994!3d-19.938226999999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x66287bc4d1c5327c!2sSavassi!5e0!3m2!1spt-BR!2sbr!4v1512238716850" width="500" height="400" frameborder="0" allowfullscreen></iframe>
              </CardMapa>
              <CardMapaCidade>
                <img alt="star" src={marker} style={styles.iconGreen} />
                <Label style={styles.labelList}> Belo Horizonte , Rua Sergipe, 1418 Belo Horizonte , 30120-000</Label>
                <Link href="">+ Como chegar</Link>
              </CardMapaCidade>
            </CardText>
            <CardText>
              <CardUser>
                <Heading level={1}>Sobre o Instrutor</Heading>
                <img src=" https://www.aciworldwide.com/-/media/images/components/text-and-media/500x333-user-group.jpg?la=en&hash=D7946C2F2D89388DD6295EB24E449D4C0B4742A8" style={styles.imageRound} />
                <Label style={styles.labelList}> <img alt="star" src={star_black} style={styles.miniIcon} /> 4,3 Classificações Média </Label>
                <Label style={styles.labelList}><img alt="text" src={message_black} style={styles.miniIcon} /> 1.395 Avaliações</Label>
                <Label style={styles.labelList}><img alt="people" src={user} style={styles.miniIcon} /> 5.742 Alunos</Label>
                <Label style={styles.labelList}><img alt="video" src={video} style={styles.miniIcon} /> 8 Cursos </Label>
              </CardUser>
              <CardUserCidade>
                <Text>
                  <Link href=""> <Heading level={1}>Kleber Donady</Heading></Link>
                  <Link href=""> <Heading level={2}>Consultor empresarial, Coach Empreendedor</Heading></Link>
                </Text>
                <Paragraph>
                  Nisi eu eiusmod cupidatat aute laboris commodo excepteur esse dolore incididunt incididunt aliquip pariatur est minim officia sit. Nulla pariatur duis duis quis commodo cupidatat voluptate enim culpa elit adipisicing do cupidatat sint anim. Cillum elit magna occaecat proident sit cupidatat ad quis sunt id culpa culpa. Ad duis nulla in incididunt amet consequat officia ad voluptate voluptate. Pariatur eiusmod ullamco cupidatat non magna officia aute magna deserunt qui aute dolor eu. Qui amet non ex cillum sunt ad velit consequat ipsum velit.
              </Paragraph>
              </CardUserCidade>
            </CardText>
            <CardText>
              <Heading level={1}>Feedback dos Alunos</Heading>
              <List>
                <CardTextContent>
                  <ItemImagem>
                    <Text style={styles.textCenter}>
                      <Label style={styles.labelFeedbackGde}> 4.1</Label>
                      <Label style={styles.labelFeedbackStar}>
                        <img alt="star" src={starGreen} style={styles.iconWhite} />
                        <img alt="star" src={starGreen} style={styles.iconWhite} />
                        <img alt="star" src={starGreen} style={styles.iconWhite} />
                        <img alt="star" src={starGreen} style={styles.iconWhite} />
                        <img alt="star" src={starGreen} style={styles.iconWhite} />
                      </Label>
                      <Label style={styles.labelFeedbackAv}> Avaliação Média</Label>
                    </Text>
                  </ItemImagem>
                  <ItemTitulo>
                    <Label style={styles.itensOutrosProdutosB}></Label>
                    <Label style={styles.progressBar}> <Progress style={styles.progress} completed={98} /></Label>
                    <Label style={styles.progressBar}> <Progress completed={75} /></Label>
                    <Label style={styles.progressBar}> <Progress completed={50} /></Label>
                    <Label style={styles.progressBar}> <Progress completed={10} /></Label>
                  </ItemTitulo>
                </CardTextContent>
              </List>
            </CardText>
            <CardText>
              <CardText>
                <Heading level={1}>Avaliações</Heading>
                <List>
                  <CardTextContent>
                    <ItemAval>
                      <Label style={styles.itensAvaliacaoCircle} >SP</Label>
                    </ItemAval>
                    <ItemAvalPes>
                      <Label style={styles.itensAvaliacaoMonth}>há um mês</Label>
                      <Label style={styles.itensAvaliacaoName}>Samantha Rohr Rocha</Label>
                      <Label style={styles.itensAvaliacaoDenun}>denunciar</Label>
                    </ItemAvalPes>
                    <ItemAvalText>
                      <Label >
                        <img alt="star" src={starGreen} style={styles.iconWhite} />
                        <img alt="star" src={starGreen} style={styles.iconWhite} />
                        <img alt="star" src={starGreen} style={styles.iconWhite} />
                      </Label>
                      <Label style={styles.itensOutrosProdutosB}>Adorei  as idéias propostas  e com certeza  aplicarei no meu dia a dia</Label>
                      <Label >Atualizado em 30/11/2017</Label>
                    </ItemAvalText>

                  </CardTextContent>
                </List>
              </CardText>
              <CardText>
                <CardTextContent>
                  <ItemAval>
                  </ItemAval>
                  <ItemAvalPes>
                  </ItemAvalPes>
                  <ItemAvalText>
                    <Button style={styles.buttonStyleTransparentBold} transparent>Mostrar mais</Button>
                  </ItemAvalText>
                </CardTextContent>
              </CardText>
            </CardText>
            <CardText>
              <CardMini style={styles.divCard}>
                <Heading level={1}>Mais cursos de Kleber Donady</Heading>
                <CardMiniContent>
                  <img src="https://udemy-images.udemy.com/course/240x135/1383810_0c42.jpg" style={styles.itensImage} />
                  <TextMiniCard style={styles.CardMiniTextContent}>
                    <Label style={styles.CardlabelMiniBold}> Curso Design Gráfico COMPLETO -7 Cursos</Label>
                    <Label style={styles.CardlabelMini} >iMedia Brasil</Label>
                    <Label style={styles.labelListStar} >
                      <img alt="star" src={starGreen} style={styles.miniIcon} />
                      <img alt="star" src={starGreen} style={styles.miniIcon} />
                      <img alt="star" src={starGreen} style={styles.miniIcon} />
                      <img alt="star" src={starGreen} style={styles.miniIcon} />
                      <img alt="star" src={starGreen} style={styles.miniIcon} />
                      <img alt="star" src={starGreen} style={styles.miniIcon} />
                      &nbsp;
                        4,6 (437)
                  </Label>
                    <DivRight>
                      <Label style={styles.labelItemNormal}> R$580</Label>
                      <Label style={styles.labelItemBold}> R$20</Label>
                    </DivRight>
                  </TextMiniCard>
                </CardMiniContent>
                <CardMiniContent>
                  <img src="https://udemy-images.udemy.com/course/240x135/1276020_afbc.jpg" style={styles.itensImage} />
                  <TextMiniCard style={styles.CardMiniTextContent}>
                    <Label style={styles.CardlabelMiniBold} >Gestão financeira para pequenas e médias</Label>
                    <Label style={styles.CardlabelMini} >Por Kleber Donady</Label>
                    <Label style={styles.labelListStar} >
                      <img alt="star" src={starGreen} style={styles.miniIcon} />
                      <img alt="star" src={starGreen} style={styles.miniIcon} />
                      <img alt="star" src={starGreen} style={styles.miniIcon} />
                      <img alt="star" src={starGreen} style={styles.miniIcon} />
                      <img alt="star" src={starGreen} style={styles.miniIcon} />
                      <img alt="star" src={starGreen} style={styles.miniIcon} />
                      &nbsp;
                        4,4 (394)
                  </Label>
                    <DivRight>
                      <Label style={styles.labelItemNormal}> R$385</Label>
                      <Label style={styles.labelItemBold}> R$20</Label>
                    </DivRight>
                  </TextMiniCard>
                </CardMiniContent>
                <CardMiniContent>
                  <img src="https://udemy-images.udemy.com/course/240x135/406424_7ca9_9.jpg" style={styles.itensImage} />
                  <TextMiniCard style={styles.CardMiniTextContent}>
                    <Label style={styles.CardlabelMiniBold} >Gestão financeira para pequenas e médias</Label>
                    <Label style={styles.CardlabelMini} >Por Kleber Donady</Label>
                    <Label style={styles.labelListStar} >
                      <img alt="star" src={starGreen} style={styles.miniIcon} />
                      <img alt="star" src={starGreen} style={styles.miniIcon} />
                      <img alt="star" src={starGreen} style={styles.miniIcon} />
                      <img alt="star" src={starGreen} style={styles.miniIcon} />
                      <img alt="star" src={starGreen} style={styles.miniIcon} />
                      <img alt="star" src={starGreen} style={styles.miniIcon} />
                      &nbsp;
                        4,4 (394)
                  </Label>
                    <DivRight>
                      <Label style={styles.labelItemNormal}> R$385</Label>
                      <Label style={styles.labelItemBold}> R$20</Label>
                    </DivRight>
                  </TextMiniCard>
                </CardMiniContent>
              </CardMini>
            </CardText>
           
            

        <Sticky >
              {
                ({
              style,

                  // the following are also available but unused in this example
                  isSticky,
                  // wasSticky,
                  distanceFromTop,
                  distanceFromBottom,
                  calculatedHeight
            }) => {
                  return (
                    <header style={style} topOffset={0} >
                      <DivMenuFloat>
                        <MenuFloat>
                          <Text>
                            <Heading level={1} reverse>Como Resolver Problemas Complexos e Tomar Decisões Efetivas</Heading>
                            <div className="ilv-rating-list">
                              <img alt="star" src={starGreen} style={styles.iconWhite} />
                              <img alt="star" src={starGreen} style={styles.iconWhite} />
                              <img alt="star" src={starGreen} style={styles.iconWhite} />
                              <img alt="star" src={starGreen} style={styles.iconWhite} />
                              <img alt="star" src={starWhite} style={styles.iconWhite} />
                              <a>4.1(32 classificações)</a>
                              185 processos concluídos
                           </div>
                          </Text>
                        </MenuFloat>
                      </DivMenuFloat>
                      <DivFloat>
                        <SectionCardFloat>
                          {/* <LogoImage height={170} /> */}
                          <Text>
                            <Label style={styles.itenValor}> R$20</Label>
                            <Label style={styles.labelGreenDesconto}> R$85</Label>
                            <Label style={styles.labelGreenText}>76% de desconto</Label>
                            <Text></Text>
                            <Button style={styles.buttonStyleGreen}>Contratar</Button>
                            <Text></Text>
                            <Button style={styles.buttonStyleTransparent} transparent>Sessão grátis</Button>
                            <Paragraph style={styles.labelSmall} >Garantia de devolução do dinheiro em 30 dias</Paragraph>
                            <Paragraph style={styles.labelListItemBlack} >Inclui</Paragraph>
                          </Text >
                          <TextList>
                            <Label style={styles.labelListItem} >   <img alt="video" src={video} style={styles.miniIcon} /> Video sob demanda de 1 hora</Label>
                          </TextList >
                          <TextList>
                            <Label style={styles.labelListItem} > <img alt="artigo" src={artigo} style={styles.miniIcon} /> 1 artigo</Label>
                          </TextList >
                          <TextList>
                            <Label style={styles.labelListItem} >  <img alt="recurso_complementar" src={recurso_complementar} style={styles.miniIcon} /> 1 recurso  complementar</Label>
                          </TextList >
                          <TextList>
                            <Label style={styles.labelListItem} >  <img alt="acesso_total" src={acesso_total} style={styles.miniIcon} /> Acesso total vitalicio</Label>
                          </TextList >
                          <TextList>
                            <Label style={styles.labelListItem} >  <img alt="dispositivos_modeis" src={dispositivos_modeis} style={styles.miniIcon} /> Acesso no dipositivo móvel  e na tv</Label>
                          </TextList >
                          <TextList>
                            <Label style={styles.labelListItem} >  <img alt="certificado_conclusao" src={certificado_conclusao} style={styles.miniIcon} /> Certificado de conclusão</Label>
                          </TextList>
                        </SectionCardFloat>
                      </DivFloat>
                    </header>
                  )
                }
              }
            </Sticky>
          </StickyContainer>

          </Section>

      </InnerWrapper>

    </Wrapper>

  )
}

Card.propTypes = {
}

export default Card
