import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import IntlCurrencyInput from "react-intl-currency-input"
import config from 'config'

const BRL = {
  locale: "pt-BR",
  formats: {
    number: {
      BRL: {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
};

const USD = {
  locale: "US",
  formats: {
    number: {
      USD: {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
};


var dictConfigCurrency = {
  'pt-BR': BRL,
  'us': USD
};

var dictCurrency = {
  'pt-BR': 'BRL',
  'us': 'USD'
};


const CurrencyInput = ({
   ...props
}) => {
  
  console.log(config.culture);
  return (
    <IntlCurrencyInput {...props}  currency={dictCurrency[config.culture]} config={dictConfigCurrency[config.culture]} />
  )
}

export default CurrencyInput
