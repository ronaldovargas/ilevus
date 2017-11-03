var React = require("react");

module.exports = React.createClass({
    getDefaultProps() {
        return {
            className: "alert alert-danger alert-dismissible",
            store: null
        };
    },
    getInitialState() {
        return {
            error: false,
            errorMessage: ""
        };
    },
    componentDidMount() {
        if (!this.props.store) {
            console.error("You must define a store for error alert handling.");
            return;
        }
        this.props.store.on('invalid', this.handleValidation, this);
        this.props.store.on('fail', this.handleFailure, this);
    },
    componentWillUnmount() {
        if (this.props.store) {
            this.props.store.off(null, null, this);
        }
    },
    handleValidation(model, errors, opts) {
        this.setState({
            error: true,
            errorMessage: errors
        });
    },
    handleFailure(errors) {
        this.setState({
            error: true,
            errorMessage: errors
        });
    },
    closeAlerts() {
        this.setState({
            error: false
        });
    },
    render() {
        if (!this.state.error)
            return <span className="hidden" />;
        if (this.state.error) {
            if (typeof this.state.errorMessage == 'string') {
                return (<div className={this.props.className} role="alert">
					<a className="close" aria-label="Fechar Alerta" onClick={this.closeAlerts}>
						<span aria-hidden="true">&times;</span>
					</a>
                {this.state.errorMessage}
                </div>);
            } else if (typeof this.state.errorMessage == 'object') {
                var errNo = 0;
                return (<div className={this.props.className} role="alert">
					<a className="close" aria-label="Fechar Alerta" onClick={this.closeAlerts}>
						<span aria-hidden="true">&times;</span>
					</a>
                <ul>
                {this.state.errorMessage.map(err => {
                    return <li key={"errmsg-"+(errNo++)}>{err}</li>;
                })}
                </ul>
                </div>);
            } else {
                return (<div className={this.props.className} role="alert">
					<a className="close" aria-label="Fechar Alerta" onClick={this.closeAlerts}>
						<span aria-hidden="true">&times;</span>
					</a>
                An unexpected error occurred.
            </div>);
            }
        }
    }
});
