import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {
  Heading,
  Paragraph,
  Field,
  Slider,
  Label,
  HorizontalRule,
  CurrencyInput,
  Button,
  List
} from 'components'

const Article = styled.article``

const ServiceCardContentForm = ({ title, body, ...props }) => {
  return (
    <Article {...props}>
      {/* implementar file upload */}
      <Field name={'precovenda'} label={'Preço Venda'} />
      <Field name={'desconto'} label={'Desconto'} />
      <Field name={'total'} label={'Total'} />
      <HorizontalRule palette={'primary'} />
      <Field name={'pontos'} label={'Principais Pontos'} />
      <Button >Add</Button>
      <List>
        <li>Analisar os problemas de outras maneiras</li>
        <li>Pensar de maneira lógica e sequencial</li>
        <li>Conhecer as ferramentas utilizadas</li>
      </List>

      <Field name={'descricao'} label={'Descrição'} type={'textarea'} />
      <Field name={'publicoalvo'} label={'Público Alvo'} type={'textarea'} />
      <Field name={'endereco'} label={'Endereço'}  />
      <Field name={'instrutor'} label={'Instrutor'}  />
      <Button >Salvar</Button>
    </Article>
  )
}

ServiceCardContentForm.propTypes = {

}

export default ServiceCardContentForm
