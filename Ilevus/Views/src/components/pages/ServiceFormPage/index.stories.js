// https://github.com/diegohaz/arc/wiki/Storybook
import React from 'react'
import { storiesOf } from '@storybook/react'
import { ServiceFormPage } from 'components'

storiesOf('ServiceFormPage', module)
  .add('default', () => (
    <ServiceFormPage />
  ))
