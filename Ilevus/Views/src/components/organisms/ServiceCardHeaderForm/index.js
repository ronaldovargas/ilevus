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

const ServiceCardHeaderForm = ({ title, body, ...props }) => {
  return (
    <Article {...props}>
      <Heading level={2}>{title}</Heading>

      <Field name={'titulo'} label={'Título'} type={'textarea'} />
      <Field name={'titulo'} label={'Sub Título'} type={'textarea'} />
      {/* <Label>Avaliação</Label>
      <Slider min={0} max={5} defaultValue={3} /> */}
      <Field name={'autor'} label={'Autor'} />
      <Field name={'idioma'} label={'Idioma'} />
      <HorizontalRule palette={'primary'} />
    
    </Article>
  )
}

ServiceCardHeaderForm.propTypes = {

}

export default ServiceCardHeaderForm
