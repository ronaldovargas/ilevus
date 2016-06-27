
var React = require("react");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var string = require("string");

var LogoWhite = require('ilevus/img/ilevus-logo-white-20px.png');

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    onSearch(evt) {
        evt.preventDefault();
        var term = this.refs['search-term'].value;
        if (!string(term).isEmpty())
            this.context.router.push("/search/" + encodeURI(term));
    },
    render() {
        return (
            <div className="ilv-page-banner" role="banner">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="ilv-page-banner-content">                              
                                <form onSubmit={this.onSearch}>
                                    <div className="ilv-form-group">
                                        <img src={LogoWhite} alt="ilevus" />
                                    </div>
                                    <div className="ilv-form-group">
                                        <h1>{Messages.get("TextSlogan")}</h1>
                                        <p>{Messages.get("TextSloganDescription")}</p>
                                    </div>
                                    <div className="ilv-form-group">
                                        <div className="ilv-input-group">
                                            <input ref="search-term" className="ilv-form-control ilv-form-control-lg" type="search" placeholder={Messages.get("TextSearchPlaceholder")} />
                                            <div className="ilv-input-group-btn">
                                                <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-neutral" type="submit">
                                                    {Messages.get("LabelSearch")}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
