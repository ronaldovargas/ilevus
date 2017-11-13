import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import ReactPhoneInput from 'react-phone-input';

const Telephone = ({
   ...props
}) => {
  return (
    <ReactPhoneInput 
          defaultCountry={'br'} 
          {...props} />
  )
}

export default Telephone
