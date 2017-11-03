var React = require('react');
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var ScheduleStore = require("ilevus/jsx/core/store/Schedule.jsx");
var MeetingScheduleConfig = require("ilevus/jsx/core/widget/user/MeetingScheduleConfig.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = createClass({
    contextTypes: {
        router: PropTypes.object
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
        ScheduleStore.on("save-config", () => {
            Toastr.remove();
            Toastr.success(Messages.get("TextDataSavedSuccessfully"));
        }, me);
    },

    componentWillUnmount() {
        ScheduleStore.off(null, null, this);
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

    saveConfig(event) {
        event && event.preventDefault();
        ScheduleStore.dispatch({
            action: ScheduleStore.ACTION_SAVE_CONFIG,
            data: {
                Enabled: this.state.enabled,
                Antecedence: this.state.enabled ? this.refs['antecedence'].valueAsNumber : this.state.antecedence,
                Interval: this.state.interval,
                HourConfig: this.state.enabled ? JSON.stringify(this.refs['schedule-config'].getConfigs()) : "[]"
            }
        });
    },

    render() {
        var user = this.state.model;
        return (
            <div>
                <h4>{Messages.get("LabelScheduleConfigurations")}</h4>
                <form className="mb-5">
                    <div className="row">
                        <div className="col">
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
                                    <input className="ilv-form-control" type="number" defaultValue={this.state.antecedence} disabled={!this.state.enabled} ref='antecedence' />
                                    <div className="ilv-input-group-addon">
                                        {Messages.get("LabelHours")}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="ilv-form-group">
                                <label className="ilv-form-label">{Messages.get("DeactivateScheduling")}</label>
                                <p>{Messages.get("DeactivateSchedulingHelpText")}</p>
                                <div className="ilv-checkbox">
									<label htmlFor="ex-form-checkebox">
										<input className="ilv-control-input" id="ex-form-checkebox" name="ex-form-radio-stacked" type="checkbox" onChange={this.enabledChange} checked={this.state.enabled} />
                                        <span className="ilv-control-indicator"></span>
                                        <span className="ilv-control-label">{Messages.get("LabelEnableSchedule")}</span>
									</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="ilv-btn ilv-btn-primary" onClick={this.saveConfig}>{Messages.get("LabelSave")}</button>
                </form>
                <div className="mb-5">
                    <h4>{Messages.get("LabelSchedule")}</h4>
                    <div className="ilv-card">
                        <div className="ilv-card-body">
                            {this.state.enabled ?
                                <MeetingScheduleConfig interval={this.state.interval} config={this.state.config} ref="schedule-config" />
                            :
                                <p><i>A agenda não está habilitada.</i></p>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});