﻿var React = require('react');
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var UserStore = require("ilevus/jsx/core/store/User.jsx");
var MeetingScheduleConfig = require("ilevus/jsx/core/widget/user/MeetingScheduleConfig.jsx");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },

    getInitialState() {
        var configs = UserSession.get("user").ScheduleConfig;
        return {
            antecedence: configs.Antecedence,
            enabled: configs.Enabled,
            interval: configs.Interval,
            config: JSON.parse(configs.HourConfig)
        };
    },

    componentDidMount() {
        var me = this;
    },

    componentWillUnmount() {
        UserStore.off(null, null, this);
    },

    changeInterval(event) {
        this.setState({
            interval: parseInt(this.refs['interval'].value)
        });
    },

    enabledChange() {
        this.setState({
            enabled: !this.state.enabled
        });
    },

    render() {
        var user = this.state.model;
        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="mb-3">
                            <h4 className="mb-2">{Messages.get("LabelScheduleConfigurations")}</h4>
                            <form>
                                <div className="ilv-form-group">
                                    <label className="ilv-form-label">{Messages.get("LabelMeetingDuration")}</label>
                                    <select className="ilv-form-control" onChange={this.changeInterval} ref="interval" defaultValue={this.state.interval} disabled={!this.state.enabled}>
                                        <option value="15">15 {Messages.get("LabelMinutes")}</option>
                                        <option value="30">30 {Messages.get("LabelMinutes")}</option>
                                        <option value="45">45 {Messages.get("LabelMinutes")}</option>
                                        <option value="60">60 {Messages.get("LabelMinutes")}</option>
                                        <option value="90">90 {Messages.get("LabelMinutes")}</option>
                                        <option value="120">120 {Messages.get("LabelMinutes")}</option>
                                    </select>
                                </div>
                                <div className="ilv-form-group">
                                    <label className="ilv-form-label">{Messages.get("LabelAntecedence")}</label>
                                    <div className="ilv-input-group">
                                        <input className="ilv-form-control" type="number" defaultValue={this.state.antecedence} disabled={!this.state.enabled} />
                                        <div className="ilv-input-group-addon">
                                            {Messages.get("LabelHours")}
                                        </div>
                                    </div>
                                </div>
                                <div className="ilv-form-group">
                                    <label className="ilv-form-label">{Messages.get("DeactivateScheduling")}</label>
                                    <p>{Messages.get("DeactivateSchedulingHelpText")}</p>
                                    <div className="ilv-checkbox">
										<label htmlFor="ex-form-checkebox">
											<input className="ilv-control-input" id="ex-form-checkebox" name="ex-form-radio-stacked" type="checkbox" onChange={this.enabledChange} />
                                            <span className="ilv-control-indicator"></span>
                                            <span className="ilv-control-label">{Messages.get("LabelEnableSchedule")}</span>
										</label>
                                    </div>
                                </div>
                                <button className="ilv-btn ilv-btn-primary">{Messages.get("LabelSave")}</button>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <label className="ilv-form-label">{Messages.get("LabelSchedule")}</label>
                        {this.state.enabled ?
                            <MeetingScheduleConfig interval={this.state.interval} config={this.state.config} />
                            :
                            <p><i>A agenda não está habilitada.</i></p>
                        }
                    </div>
                </div>
            </div>   
        )
    }
});