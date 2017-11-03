
var _ = require("underscore");
var S = require("string");
var marked = require("marked");
var moment = require("moment");
var numeral = require("numeral");
var React = require('react');

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = createClass({
    propTypes: {
        sessions: PropTypes.array.isRequired,
        current: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired
    },
    getDefaultProps() {
        return {
            sessions: [],
            onChange: _.noop
        };
    },
    getInitialState() {
        return {
        };
    },

    selectSession(index, event) {
        event && event.preventDefault();
        this.props.onChange(index);
    },

    renderTable() {
        var history = [];
        if (this.props.current != (this.props.sessions.length - 1)) {
            history.push(<tr key={"session-"+i}>
                <td>
                    <div className="font-weight-bold">{Messages.get('LabelCurrentSession')}</div>
                </td>
                <td className="text-right">
                    <a className="ilv-btn ilv-btn-sm ilv-btn-clean px-0" href="#" onClick={this.selectSession.bind(this, this.props.sessions.length - 1)}>
                        <i className="ilv-icon material-icons md-24">&#xE5CC;</i>
                    </a>
                </td>
            </tr>);
        }
        for (var i = this.props.sessions.length - 2; i >= 0; i--) {
            var duration = moment.duration(moment(this.props.sessions[i].Finished).diff(moment(this.props.sessions[i].Started), "seconds"), "seconds"),
                durationString = (
                    numeral(duration.hours()).format("00") + ":" +
                    numeral(duration.minutes()).format("00") + ":" +
                    numeral(duration.seconds()).format("00")
                )
            ;
            history.push(<tr key={"session-"+i}>
                <td>
                    <div className="font-weight-bold">{Messages.get('LabelSession')} {i + 1}</div>
                    <small>{Messages.get('LabelDuration')}: {durationString}</small>
                </td>
                <td className="text-right">
                    <a className="ilv-btn ilv-btn-sm ilv-btn-clean px-0" href="#" onClick={this.selectSession.bind(this, i)}>
                        <i className="ilv-icon material-icons md-24">&#xE5CC;</i>
                    </a>
                </td>
            </tr>);
        }
        return (<table className="ilv-table mb-0">
            <thead>
                <tr style={{backgroundColor: '#f5f7f9'}}>
                    <th className="text-center" colSpan="2"><small className="font-weight-bold">{Messages.get("TextSessionHistory")}</small></th>
                </tr>
            </thead>
            <tbody>
                {history}
            </tbody>
        </table>);
    },

    render() {
        if (!this.props.sessions || (this.props.sessions.length <= 1))
            return <div />;
        return <div className="ilv-card mb-5">
            <div className="ilv-card-block">
                {this.renderTable()}
            </div>
        </div>;
    }
});
