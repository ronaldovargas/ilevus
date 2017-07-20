
var React = require("react");
var MaskedInput = require('react-maskedinput')

var CustomInput = React.createClass({
  render() {
    return <MaskedInput
      mask="1111-WW-11"
      placeholder="1234-WW-12"
      size="11"
      {...this.props}
      formatCharacters={{
        'W': {
          validate(char) { return /\w/.test(char ) },
          transform(char) { return char.toUpperCase() }
        }
      }
    }/>
  }
})

