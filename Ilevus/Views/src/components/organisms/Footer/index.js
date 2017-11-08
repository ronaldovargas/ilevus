import React from 'react'

const Messages = require('ilevus/jsx/core/util/Messages')

const Footer = (props) => {
  return (
    <footer {...props} className="ilv-lp-footer">
      <div className="footer-top padd-top padd-bottom">
        <div className="container" id="FooterContent">
          {Messages.getFile(Messages.get('TextFooterContent'), 'FooterContent')}
        </div>
      </div>
    </footer>
  )
}

export default Footer
