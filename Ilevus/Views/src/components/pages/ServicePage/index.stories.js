// https://github.com/diegohaz/arc/wiki/Storybook
import React from 'react'
import { storiesOf } from '@storybook/react'
import { ServicePage } from 'components'

storiesOf('ServicePage', module)
  .add('default', () => (
    <ServicePage />
  ))
