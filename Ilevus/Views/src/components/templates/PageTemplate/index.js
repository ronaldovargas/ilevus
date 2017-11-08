import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { size } from 'styled-theme'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
`

const Content = styled.section`
  width: 100%;
  box-sizing: border-box;
  margin: 2rem auto;
  max-width: ${size('maxWidth')};
`

const PageTemplate = ({
  children, ...props
}) => {
  return (
    <Wrapper {...props}>
      <Content>{children}</Content>
    </Wrapper>
  )
}

PageTemplate.propTypes = {
  children: PropTypes.any.isRequired,
}

export default PageTemplate
