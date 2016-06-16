
var React = require("react");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var string = require("string");

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
            <div className="page-banner" role="banner">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12">
                            <div style={{color: '#fff'}}>
                                <h1 className="display-4 font-weight-bold">
                                    {Messages.get("TextSlogan")}
                                </h1>
                                <p className="lead">
                                    {Messages.get("TextSloganDescription")}
                                </p>
                            </div>
                            <form className="row p-y-1" onSubmit={this.onSearch}>
                                <div className="form-group col-xs-12 col-sm-8 col-md-9">
                                    <input ref="search-term"
                                           className="form-element form-element-lg"
                                           type="search"
                                           placeholder={Messages.get("TextSearchPlaceholder")} />
                                </div>
                                <div className="form-group col-xs-12 col-sm-4 col-md-3">
                                    <button className="btn btn-lg btn-block btn-brand" type="submit">
                                        {Messages.get("LabelSearch")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
