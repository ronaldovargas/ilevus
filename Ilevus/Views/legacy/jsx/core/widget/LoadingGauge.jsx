
var React = require('react');

var LoadingGif = require('ilevus/img/loading.gif');

module.exports = React.createClass({
    shouldComponentUpdate() {
        return false;
    },
	render() {
		return (<div
				style={{
					backgroundImage: 'url('+LoadingGif+')',
					backgroundPosition: 'center center',
					backgroundRepeat: 'no-repeat',
					width:'175px',
					height: '175px',
					display: 'block',
					margin: '20px auto',
					backgroundSize: 'cover'
				}}
				></div>);
	}
});