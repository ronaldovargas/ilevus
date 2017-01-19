
var _ = require("underscore");
var S = require("string");
var moment = require("moment");
var React = require("react");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var AdStore = require("ilevus/jsx/core/store/Ad.jsx");

module.exports = React.createClass({
    propTypes: {
        ad: React.PropTypes.object,
        onSubmit: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired
    },
    getDefaultProps() {
        return {
            ad: null,
            onSubmit: null,
            onCancel: null
        };
    },
    getInitialState() {
        return {
            saving: false,
            activated: this.props.ad ? this.props.ad.Active : false,
            keywords: this.props.ad ? this.props.ad.Keywords : []
        };
    },

    componentDidMount() {
        var me = this;
        AdStore.on("save-ad", (ad) => {
            me.setState({
                saving: false
            });
            me.props.onSubmit(ad);
        }, me);
        AdStore.on("fail", (meeting) => {
            me.setState({
                saving: false
            });
        }, me);
    },
    componentWillUnmount() {
        AdStore.off(null, null, this);
    },

    cancel(event) {
        event && event.preventDefault();
        this.props.onCancel();
    },
    saveAd(event) {
        event && event.preventDefault();
        this.setState({
            saving: true
        });
        AdStore.dispatch({
            action: AdStore.ACTION_SAVE,
            data: {
                Id: this.props.ad ? this.props.ad.Id : undefined,
                Headline: this.refs['headline'].value,
                Image: this.refs['image'].value,
                Link: this.refs['link'].value,
                Active: this.state.activated,
                Keywords: this.state.keywords
            }
        });
    },

    addKeyword(event) {
        event && event.preventDefault();
        var keyword = S(this.refs['keyword'].value);
        if (!keyword.isEmpty()) {
            this.state.keywords.push(keyword.s);
            this.refs['keyword'].value = "";
            this.forceUpdate();
        }
    },
    removeKeyword(index, event) {
        event && event.preventDefault();
        this.state.keywords.splice(index, 1);
        this.forceUpdate();
    },
    activatedChange() {
        this.setState({
            activated: !this.state.activated
        });
    },

    render() {
        return(
            <div className="row">
                <div className="col">
                    <h4>{!this.props.ad ? Messages.get("LabelNewAd"):Messages.get("LabelEditAd")}</h4>
                    <form onSubmit={this.saveAd}>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelHeadline")}</label>
                            <input className="ilv-form-control" type="text" spellCheck={false} ref="headline" defaultValue={this.props.ad ? this.props.ad.Headline:""} />
                        </div>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelAdImage")}</label>
                            <input className="ilv-form-control" type="url" spellCheck={false} ref="image" defaultValue={this.props.ad ? this.props.ad.Image:""} />
                        </div>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelAdUrl")}</label>
                            <input className="ilv-form-control" type="url" spellCheck={false} ref="link" defaultValue={this.props.ad ? this.props.ad.Link:""} />
                        </div>

                        <fieldset className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelKeywords")}</label>
                            <div className="ilv-input-group">
                                <input className="ilv-form-control" type="text" spellCheck={false} ref="keyword" />
                                <div className="ilv-input-group-btn">
                                    <button className="ilv-btn ilv-btn-lg ilv-btn-icon ilv-btn-success" onClick={this.addKeyword}>
                                        <i className="ilv-icon material-icons md-24">&#xE145;</i>
                                    </button>
                                </div>
                            </div>
                            <div className="ilv-tag-input m-b-1 ilv-text-xs-center" style={{backgroundColor: '#f5f7f9'}} readOnly={true}>
                                {this.state.keywords.length == 0 ?
                                    <i>{Messages.get("TextNoKeywordsAddedYet")}</i>
                                    :
                                    this.state.keywords.map((keyword, index) => {
                                        return <span className="ilv-tag" key={"keyword-" + index }>
                                            {keyword}<a title={Messages.get("ActionRemove")} onClick={this.removeKeyword.bind(this, index)}>&times;</a>
                                        </span>;
                                    })
                                }
                            </div>
                        </fieldset>

                        <div className="ilv-form-group">
                                <div className="ilv-checkbox">
									<label htmlFor="ad-activated">
										<input className="ilv-control-input" type="checkbox" id="ad-activated" name="ad-activated" onChange={this.activatedChange} checked={this.state.activated} />
                                        <span className="ilv-control-indicator"></span>
                                        <span className="ilv-control-label">{Messages.get("LabelAdActivated")}</span>
									</label>
                                </div>
                        </div>

                        <input className="ilv-btn ilv-btn-lg ilv-btn-primary" type="submit" value={Messages.get("LabelSave")} disabled={this.state.saving} />
                        <input className="ilv-btn ilv-btn-lg ilv-btn-clean" type="button" value={Messages.get("LabelCancel")} onClick={this.cancel} />
                    </form>
                </div>
            </div>
        )
    }
});

