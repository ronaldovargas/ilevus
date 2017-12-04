import React from 'react'
import { storiesOf } from '@storybook/react'
import { ServiceCardContentForm } from 'components'

storiesOf('ServiceCardContentForm', module)
  .add('default', () => (
    <Post title="Hello" body="Ullamco et reprehenderit magna cillum ullamco consectetur et enim aliqua." />
  ))
