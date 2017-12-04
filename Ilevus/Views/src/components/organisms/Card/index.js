import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ifProp } from 'styled-tools'
import { palette, size } from 'styled-theme'


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
  position:relative;
   padding-left: 4rem;
  box-sizing: border-box;
  color:#fff;
  height:280px;
  @media screen and (max-width: 640px) {
     padding-left: 0.25rem;
     padding-right: 0.025rem;
  }
`

const InnerWrapper = styled.div`
  display: flex;
  width: 90%;
  
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
  width:80%;
  &:first-child {
    flex: none;
  }
  @media screen and (max-width: 640px) {
    padding: 0.025rem;
    width: 90%;
  }
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

const CardGroup = styled.div`
  margin-top: 2rem;
  display: flex;
  position:relative;
  background-color:#fff;
  border: 1 solid black;
 // padding-left:3em;
  width:300px;
  height:700px;
  > :not(:first-child) {
    // margin-left: 0.5rem;
  }
`

const ListGroup = styled.div`
margin-top: 2rem;
// display: flex;
position:relative;
background-color:#f2f2f2;
border: 1 solid black;
width:800px;
// height:1200px;
padding-left:2rem;

`

const CardText = styled.div`
margin-top: 2rem;
position:relative;
width:800px;
// height:800px;
// padding-left:2rem;

`


const CardTextContent = styled.div`
position:relative;
width:800px;
height:200px;
// padding-left:2rem;
border-bottom: 1px solid #efefef;

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
const Mapa = styled.div `
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
width:800px;
 height:400px;
padding-left:2rem;

`
const CardMiniContent = styled.div`
position:relative;
width:200px;
height:280px;
background-color:#fff;
// padding-left:2rem;
border: 1px solid #efefef;

`
const DivFloat = styled.div`
position: fixed;
right:25%;
top:10%;
width: 8em;
margin-top: -2.5em;
@media screen and (max-width: 800px) {
  right:1%;
  
}
`
const styles = {
    buttonStyleGreen: {
      backgroundColor: "#2CBC4D",
      width:"13em",
      margingBottom:"1em",
    },
    buttonStyleTransparent:{
      backgroundColor: "transparent",
      color: "#2CBC4D",
      width:"13em",
      top:"1em"
    },
    buttonStyleTransparentBold:{
      backgroundColor: "transparent",
      color: "#00aa38",
      width:"13em",
      top:"2em"
    },
    divCard: {
      border:"0.0625em solid #e7e7e7",
      marginTop:"2rem"
    },
    labelSmall:{
      fontSize:"8"
    },
    labelListItem:{
      fontSize:"10",
    },
    labelGreen:{
      color:"#2CBC4D",
    },
    labelGreenText:{
      color:"#2CBC4D",
      display:"block",
    },
    labelBold:{
      textDecoration:"bold",
      fontWeight:"bold",
      fontSize:"40",
     
    },
    labelList:{
      fontSize:"14",
      position:"relative",
      display:"flex",
      // top:"80px"
    },
    List:{
      // position:"absolute",
      width:"650px",
      // display:"block",
    },
    ListItens:{
      // position:"absolute",
      width:"400px",
      float:"left",
      marginLeft:"10"
      // display:"block",
    },
    labelBoldList:{
      textDecoration:"bold",
      fontWeight:"bold",
      fontSize:"40",
      display:"block",
    },
    itensOutrosProdutosB:{
      fontWeight:"bold",
      fontSize:"16",
      display:"block",
    },
    itensImage:{
      width:"200px",
        // display:"block",
    },
    itensOutrosMini:{
      fontSize:"20",
    },
    labelItemBold:{
      color:"#2CBC4D",
      fontSize:"25",
      fontWeight:"bold"
    },
    imageRound:{
      borderRadius:"50%",
      width:"120",
      height:"120"
    },
    labelFeedbackGde:{
      fontSize:"65",
      fontWeight:"bold",
      display:"block",
      lineHeight: "1em"    
    },
    labelFeedbackStar:{
      fontSize:"15",
      display:"block",
    },
    labelFeedbackAv:{
      fontSize:"15",
      display:"block",
    },
    textCenter:{
      textAlign:"center"
    },
    itensAvaliacaoCircle:{
      border:"0.0625em solid #000",
      padding:"1em",
      borderRadius:"50%",
      marginTop:"2em"
    },
    itensAvaliacaoMonth:{
      display:"block",
      fontSize:"12",
      color:"#a5a4a4",
     
    },
    itensAvaliacaoName:{
      display:"block",
      fontSize:"15",
    },
    itensAvaliacaoDenun:{
      display:"block",
      fontSize:"12",
    },
     buttonMais: {
      // backgroundColor: "#fff",
      color:"2CBC4D",
      
      borderColor:"2CBC4D",
      width:"13em",
      margingBottom:"1em",
    },
    itenValor:{
      fontSize:"50",
      fontWeight:"bold",
      lineHeight: "1em"    
    }
  }



const Card = ({ ...props }) => {
  return (
    <Wrapper opaque reverse {...props}>
      <InnerWrapper>
        <Section>
          <Text>
            <Heading level={1} reverse>Como Resolver Problemas Complexos e Tomar Decisões Efetivas</Heading>
            <Heading level={2} reverse> Saiba analisar um problema complexo estruturar seus pensamentos de maneira lógica e tomar a melhor decisão possível</Heading>
          </Text>
          <Text>
            <Label reverse>4.1(32 classificações)</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Label reverse>185 processos concluídos</Label>
          </Text>
          <Text>
            <Label reverse>Criado por Kleber Donady</Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Label reverse>Portugues</Label>
          </Text>
          <Text>
          </Text>
          <ListGroup style={styles.divCard}>
          <Text style={styles.List}>
              <Label style={styles.labelBoldList}>Principais pontos</Label>
          </Text>
          <Text style={styles.ListItens}>
              <Label style={styles.labelList}> / Analisar os problemas de outras maneiras, descobrindo novas oportuniadades. </Label>
              <Label style={styles.labelList}> / Pensar de maneira lógica e sequencial. </Label>
          </Text>
          <Text>
              <Label style={styles.labelList}> / Conhecerá ferramentas utilizadas por empresas referencia de mercado para resolução de problemas complexos e Tomar Decisões efetivas é uma das mais requisitadas da atualidade? e tende a ser por muito mais tempo? </Label>
              <Label style={styles.labelList}> / Tomar desizões mais efetivas. </Label>
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
                        <img src="https://reactjs.org/logo-og.png" style={styles.itensImage}/>
                        <Label style={styles.itensOutrosMini} >1 hora</Label>
                    </ItemImagem>
                    <ItemTitulo>
                         <Label style={styles.itensOutrosProdutosB}>Como Resolver Problemas Complexos e Tomar desisões Efetivas</Label>
                         <Label >Atualizado em 30/11/2017</Label>
                    </ItemTitulo>
                    <ItemPontos>
                        <Label> * 4.1</Label>
                    </ItemPontos>
                    <ItemViews>
                        <Label> :) 185</Label>
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
                <Label style={styles.labelList}> Belo Horizonte , Rua Sergipe, 1418 Belo Horizonte , 30120-000</Label>
                <Link href="">+ Como chegar</Link>
            </CardMapaCidade>
          </CardText>
          <CardText>
            <CardUser>
               <Heading level={1}>Sobre o Instrutor</Heading>
               <img src=" https://www.aciworldwide.com/-/media/images/components/text-and-media/500x333-user-group.jpg?la=en&hash=D7946C2F2D89388DD6295EB24E449D4C0B4742A8" style={styles.imageRound}/>
               <Label style={styles.labelList}>4,3 Classificações Média </Label>
               <Label style={styles.labelList}>1.395 Avaliações</Label>
               <Label style={styles.labelList}>5.742 Alunos</Label>
               <Label style={styles.labelList}>8 Cursos </Label>
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
                        <Label style={styles.labelFeedbackStar}> *****</Label>
                        <Label style={styles.labelFeedbackAv}> Avaliação Média</Label>
                    </Text>
                </ItemImagem>
                <ItemTitulo>
                     <Label style={styles.itensOutrosProdutosB}>************************</Label>
                     <Label style={styles.itensOutrosProdutosB}>*************************</Label>
                     <Label style={styles.itensOutrosProdutosB}>*******************************</Label>
                     <Label style={styles.itensOutrosProdutosB}>*******************************</Label>
                     <Label style={styles.itensOutrosProdutosB}>**********</Label>
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
                         <Label >*********************</Label>
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
                      <Button  style={styles.buttonStyleTransparentBold} transparent>Mostrar mais</Button>
                  </ItemAvalText>
              </CardTextContent>
          </CardText>
        </CardText>
        <CardText>
            <CardMini style={styles.divCard}>
              <Heading level={1}>Mais cursos de Kleber Donady</Heading>
                <CardMiniContent>
                <img src="https://reactjs.org/logo-og.png" style={styles.itensImage}/>
                <Text>
                  <Label style={styles.labelList} >Gestão financeira para pequenas e médias</Label>
                  <Label style={styles.labelList} >Por Kleber Donady</Label>
                  <Label style={styles.labelList} >****** 4,4(394)</Label>
                  <Label style={styles.labelItemNormal}> R$385</Label>
                  <Label style={styles.labelItemBold}> R$20</Label>
                </Text>
               
              </CardMiniContent>
              </CardMini>
        </CardText>

        </Section>
        <Section >
         <DivFloat>
         <CardGroup style={styles.divCard}>
          <Section>
            <LogoImage height={170} />
            <Text>
              <Label style={styles.itenValor}> R$20</Label>
              <Label  style={styles.labelGreen}> R$85</Label>
              <Label  style={styles.labelGreenText}>76% de desconto</Label>
              <Text></Text>
              <Button style={styles.buttonStyleGreen}>Contratar</Button>
              <Text></Text>
              <Button  style={styles.buttonStyleTransparent} transparent>Sessão grátis</Button>
              <Paragraph style={styles.labelSmall} >Garantia de devolução do dinheiro em 30 dias</Paragraph>
              <Paragraph style={styles.labelListItem} >Inclui</Paragraph>
            </Text >
            <Text>
              <Label style={styles.labelListItem} > * Video sob demanda de 1 hora</Label>
            </Text >
            <Text>
              <Label style={styles.labelListItem} > * 1 artigo</Label>
            </Text >
            <Text>
              <Label style={styles.labelListItem} > * 1 recurso  complementar</Label>
            </Text >
            <Text>
              <Label style={styles.labelListItem} > * Acesso total vitalicio</Label>
            </Text >
            <Text>
              <Label style={styles.labelListItem} > * Acesso no dipositivo móvel  e na tv</Label>
            </Text >
            <Text>
              <Label style={styles.labelListItem} > * Certificado de conclusão</Label>
            </Text>
            </Section>
          </CardGroup>
            </DivFloat>
        </Section>
      </InnerWrapper>
    
    </Wrapper>
  )
}

Card.propTypes = {
}

export default Card
