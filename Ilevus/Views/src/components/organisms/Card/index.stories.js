import React from 'react'
import { storiesOf } from '@storybook/react'
import { Card } from 'components'

storiesOf('Card', module)
  .add('default', () => (
    <Card title="ARc">
      Ullamco duis in labore consectetur ad exercitation esse esse duis mollit sint.
    </Card>
  ))
  
