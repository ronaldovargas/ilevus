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

const ServiceCardUploadForm = ({ title, body, ...props }) => {
  return (
    <Article {...props}>
      {/* implementar file upload */}
      <Label>Upload Midia</Label>
      <Field name={'midia'} label={'Midia'} />
     
      <Button >upload</Button>
    </Article>
  )
}

ServiceCardUploadForm.propTypes = {

}

export default ServiceCardUploadForm
