
var moment = require("moment");
var React = require("react");
var S = require("string");
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var ScheduleStore = require("ilevus/jsx/core/store/Schedule.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    propTypes: {
        config: React.PropTypes.array.isRequired,
        interval: React.PropTypes.number.isRequired
    },
    getDefaultProps() {
        return {
            interval: null
        };
    },
    getInitialState() {
        var config = this.props.config || [];
        var windows = (24 * 60 / this.props.interval);
        if (config.length < windows) {
            for (var i = config.length; i < windows; i++) {
                config.push([false, false, false, false, false, false, false]);
            }
        } 
        while (config.length > windows) {
            config.pop();
        }
        
        return {
            config: config,
            interval: this.props.interval
        };
    },

    componentDidMount() {
        var me = this;

    },
    componentWillUnmount() {
        ScheduleStore.off(null, null, this);
    },

    componentWillReceiveProps(newProps) {
        if (this.props.interval != newProps.interval) {
            var config = this.state.config || [];
            var windows = (24 * 60 / newProps.interval);
            if (config.length < windows) {
                for (var i = config.length; i < windows; i++) {
                    config.push([false, false, false, false, false, false, false]);
                }
            }
            while (config.length > windows) {
                config.pop();
            }
            this.setState({
                interval: newProps.interval,
                config: config
            });
        }
    },

    getConfigs() {
        return this.state.config;
    },

    onCheck(hour, day, event) {
        this.state.config[hour][day] = event.target.checked;
        this.forceUpdate();
    },

    renderCalendarForConfig() {
        var days = [];
        for (var i = 0; i < 7; i++) {
            days.push(moment().day(i));
        }
        var firstHour = moment().hours(0).minutes(0);
        return (<table className="ilv-schedule">
            <thead>
                <tr>
                    <th>
                        {Messages.get("LabelHour")}
                    </th>
                    {days.map((day, idx) => {
                        return (<th key={"day-header-"+idx}>
                            <div>{day.format("ddd")}</div>
                        </th>);
                    })}
                </tr>
            </thead>
            <tbody>
                {this.state.config.map((daysChecked, hour) => {
                    var hourAux = moment(firstHour).minutes(this.state.interval*hour);
                    return (<tr key={"hour-row-" + hour}>
                        <td>{hourAux.format("HH:mm")}</td>
                        {daysChecked.map((checked, day) => {
                            return (<td key={"hour-" + hour + "-day-" + day} className={checked ? "checked" : ""}>
                                <input className="ilv-form-control" type="checkbox" ref={"checkbox-"+hour+"-"+day} checked={checked} onChange={this.onCheck.bind(this, hour, day)} />
                            </td>);
                        })}
                    </tr>);
                })}
            </tbody>
        </table>);
    },

    render() {
        return <div>
            {this.renderCalendarForConfig()}
        </div>;
    }
});
