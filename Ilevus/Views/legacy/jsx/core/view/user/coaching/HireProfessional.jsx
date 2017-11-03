
var React = require('react');
var S = require("string");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var CoachingStore = require("ilevus/jsx/core/store/Coaching.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

module.exports = createClass({
    contextTypes: {
        router: PropTypes.object.isRequired
    },
    componentDidMount() {
        var me = this;
        // TODO deve-se implementar o fluxo de pagamento e contratação aqui.
        // Por enquanto o processo de coaching é iniciado automaticamente.
        CoachingStore.dispatch({
            action: CoachingStore.ACTION_HIRE_PROFESSIONAL,
            data: this.props.params.id
        });

        CoachingStore.on("professional-hired", (process) => {
            me.context.router.push("/coaching/process/" + process.Id);
        }, me);
    },
    componentWillUnmount() {
        CoachingStore.off(null, null, this);
    },

    render() {
        return (
            <LoadingGauge />
        )
    }
});

