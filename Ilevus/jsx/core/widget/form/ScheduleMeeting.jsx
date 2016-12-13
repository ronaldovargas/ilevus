var React = require("react");

var ScheduleMeetingForm = React.CreateClass({
    render() {
        return(
            <div className="row">
                <div className="col-md-4">
                    <div className="ilv-form-group text-xs-center">
                        <div className="ilv-avatar-fluid ilv-avatar-fluid-xl mb-1"
                            style={{ backgroundImage: "url(" + (S(user.get("Image")).isEmpty() ? UserIcon : user.get("Image")) + ")" }} />
                        <p className="h3"> {user.get("Name")} {user.get("Surname")} </p>
                        
                        <span>{Messages.get("LabelInvestmentPrice")}</span>
                        <p className="h1">R$150,00</p>
                    </div>
                    <hr />
                    <div className="ilv-media-list">
                        <div className="ilv-media">
                            <div className="ilv-media-left">
                                <i className="ilv-text-primary ilv-icon material-icons md-24">&#xE8DF;</i>
                            </div>
                            <div className="ilv-media-body">
                                <label className="ilv-form-label">{Messages.get("LabelWhen")}:</label>
                                Sexta, 04 de novembro de 2016 às 09:00
                            </div>
                        </div>
                        <div className="ilv-media">
                            <div className="ilv-media-left">
                                <i className="ilv-text-primary ilv-icon material-icons md-24">&#xE0C8;</i>
                            </div>
                            <div className="ilv-media-body">
                                <label className="ilv-form-label">{Messages.get("LabelWhere")}:</label>
                                Rua Saldanha Marinho, 116. Edifício Liberal Center. Sala 903. (Centro) 88010450 Florianópolis, Santa Catarina SC
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <form>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelFirstMeeting")}</label>
                            <input className="ilv-form-control" type="text" />
                        </div>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelCompleteName")}</label>
                            <input className="ilv-form-control" type="text" />
                        </div>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelEmailAddress")}</label>
                            <input className="ilv-form-control" type="text" />
                        </div>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelPhoneNumber")}</label>
                            <input className="ilv-form-control" type="text" />
                        </div>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelInterviewSubject")}</label>
                            <textarea className="ilv-form-control"></textarea>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
});

module.exports = {
    ScheduleMeetingForm
};
