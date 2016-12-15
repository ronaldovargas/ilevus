var React = require('react');
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var UserStore = require("ilevus/jsx/core/store/User.jsx");
var MeetingSchedule = require("ilevus/jsx/core/widget/user/MeetingSchedule.jsx");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },

    getInitialState() {
        return {
            model: null
        };
    },

    componentDidMount() {
        var me = this;
        UserStore.on("fail", (msg) => {
            Toastr.error(msg);
        }, me);
        UserStore.on("retrieve", (model) => {
            me.setState({
                model: model
            });
        }, me);

        UserStore.dispatch({
            action: UserStore.ACTION_RETRIEVE,
            data: this.props.params.id
        });
    },

    componentWillUnmount() {
        UserStore.off(null, null, this);
    },

    render() {
        var user = this.state.model;
        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="mb-3">
                            <h4 className="mb-2">{Messages.get("ScheduleConfigurations")}</h4>
                            <form>
                                <div className="ilv-form-group">
                                    <label className="ilv-form-label">{Messages.get("MeetingDuration")}</label>
                                    <select className="ilv-form-control">
                                        <option>15 minutos</option>
                                        <option>30 minutos</option>
                                        <option>45 minutos</option>
                                        <option>60 minutos</option>
                                        <option>90 minutos</option>
                                        <option>120 minutos</option>
                                    </select>
                                </div>
                                <div className="ilv-form-group">
                                    <label className="ilv-form-label">{Messages.get("MinAdvanceForScheduling")}</label>
                                    <div className="ilv-input-group">
                                        <input className="ilv-form-control" type="number" />
                                        <div className="ilv-input-group-addon">
                                            Horas
                                        </div>
                                    </div>
                                </div>
                                <div className="ilv-form-group">
                                    <label className="ilv-form-label">{Messages.get("DeactivateScheduling")}</label>
                                    <p>{Messages.get("DeactivateSchedulingHelpText")}</p>
                                    <div className="ilv-radio">
										<label for="ex-form-radio-stacked-1">
											<input className="ilv-control-input" id="ex-form-radio-stacked-1" name="ex-form-radio-stacked" type="radio" />
                                            <span className="ilv-control-indicator"></span>
                                            <span className="ilv-control-label">{Messages.get("AllowScheduling")}</span>
										</label>
                                    </div>
									<div className="ilv-radio">
										<label for="ex-form-radio-stacked-2">
											<input className="ilv-control-input" id="ex-form-radio-stacked-2" name="ex-form-radio-stacked" type="radio" />
                                            <span className="ilv-control-indicator"></span>
                                            <span className="ilv-control-label">{Messages.get("LockScheduling")}</span>
										</label>
									</div>
                                </div>
                                <button className="ilv-btn ilv-btn-primary">{Messages.get("LabelSave")}</button>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <label className="ilv-form-label">{Messages.get("LabelSchedule")}</label>
                        <MeetingSchedule user={user} />
                    </div>
                </div>
            </div>   
        )
    }
});