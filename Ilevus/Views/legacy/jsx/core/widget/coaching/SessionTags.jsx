
var _ = require("underscore");
var S = require("string");
var React = require('react');

var CoachingStore = require("ilevus/jsx/core/store/Coaching.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");

module.exports = createClass({
    propTypes: {
        process: PropTypes.object.isRequired,
        session: PropTypes.object.isRequired,
        sessionIndex: PropTypes.number.isRequired,
        isCoach: PropTypes.bool.isRequired,
    },
    getDefaultProps() {
        return {
            process: null
        };
    },

    componentDidMount() {
        
    },
    componentWillReceiveProps() {
        
    },

    addTag(event) {
        event && event.preventDefault();
        var el = this.refs['field-tag'],
            tag = S(el.value);
        if (tag.isEmpty())
            return;
        CoachingStore.dispatch({
            action: CoachingStore.ACTION_ADD_TAG,
            data: {
                ProcessId: this.props.process.Id,
                Session: this.props.sessionIndex,
                Tag: tag.s
            }
        });
        if (this.props.session.Tags)
            this.props.session.Tags.push(tag.s);
        else
            this.props.session.Tags = [tag.s];
        el.value = "";
        this.forceUpdate();
    },
    removeTag(index, event) {
        event && event.preventDefault();
        CoachingStore.dispatch({
            action: CoachingStore.ACTION_REMOVE_TAG,
            data: {
                ProcessId: this.props.process.Id,
                Session: this.props.sessionIndex,
                Tag: index
            }
        });
        this.props.session.Tags.splice(index, 1);
        this.forceUpdate();
    },

    render() {
        var tags = this.props.session.Tags || [];
        return (<div>
            <fieldset className="ilv-form-group">
                <label className="ilv-form-label">{Messages.get("LabelTags")}</label>
                <div className="ilv-input-group">
                    <input className="ilv-form-control ilv-form-control-lg"
                           ref="field-tag"
                           spellCheck={false} />
                    <div className="ilv-input-group-btn">
                        <button className="ilv-btn ilv-btn-lg ilv-btn-icon ilv-btn-success" onClick={this.addTag}>
                            <i className="ilv-icon material-icons md-24">&#xE145;</i>
                        </button>
                    </div>
                </div>
            </fieldset>

            <fieldset className="ilv-form-group">
                <div className="ilv-tag-input mb-2 ilv-text-xs-center" style={{backgroundColor: '#f5f7f9'}} readOnly={true}>
                    {tags.map((tag, index) => {
                        return <span className="ilv-tag" key={"tag-" + index }>
                            {tag} <a title={Messages.get("ActionRemoveTag")} onClick={this.removeTag.bind(this, index)}>&times;</a>
                        </span>;
                    })}
                </div>
            </fieldset>
        </div>);
    }
});
