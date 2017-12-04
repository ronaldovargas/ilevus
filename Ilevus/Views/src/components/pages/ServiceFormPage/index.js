// https://github.com/diegohaz/arc/wiki/Atomic-Design
import React from 'react'

import { PageTemplate } from 'components'
import { ServiceCardHeaderForm } from 'components'
import { ServiceCardContentForm } from 'components'
import { ServiceCardUploadForm } from 'components'

const ServiceFormPage = () => {
  return (
    <PageTemplate>

      {/* arrastar para organismos */}
      <ServiceCardHeaderForm />
      <ServiceCardUploadForm />
      <ServiceCardContentForm />
      {/* arrastar para organismos */}
     
    </PageTemplate>
  )
}

export default ServiceFormPage
