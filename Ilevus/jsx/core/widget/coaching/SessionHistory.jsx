
var _ = require("underscore");
var S = require("string");
var marked = require("marked");
var React = require('react');

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    propTypes: {
        sessions: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired
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
        for (var i = this.props.sessions.length-2; i >= 0; i--) {
            history.push(<tr key={"session-"+i}>
                <td>
                    <div className="font-weight-bold">{Messages.get('LabelSession')} {i + 1}</div>
                    <small>{Messages.get('LabelDuration')}: 1:13</small>
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
