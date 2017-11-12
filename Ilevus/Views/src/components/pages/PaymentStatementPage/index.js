// https://github.com/diegohaz/arc/wiki/Atomic-Design
import React from 'react'

import { PageTemplate } from 'components'
import { PaymentStatement } from 'containers'

const HomePage = () => {
  return (
    <PageTemplate>
      <PaymentStatement />
    </PageTemplate>
  )
}

export default HomePage
