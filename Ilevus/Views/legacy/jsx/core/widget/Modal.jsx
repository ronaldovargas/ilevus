
var _ = require('underscore');
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var EL = document.getElementById("main-global-modal");

var AlertModal = createClass({
	render() {
		return (
			<div className="modal-dialog modal-sm fade in">
				<div className="modal-content">
					<div className="modal-header">
	        			<a className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a>
	        			<h4 className="modal-title" id="myModalLabel">{this.props.title}</h4>
	      			</div>
	      			<div className="modal-body">
	        			{this.props.message}
	      			</div>
	      			<div className="modal-footer">
	        			<button type="button" className="ilv-btn ilv-btn-primary ilv-btn-sm" data-dismiss="modal">Ok</button>
	      			</div>
				</div>
			</div>
		);
	}
});

var ConfirmModal = createClass({
	render() {
		return (
			<div className="modal-dialog modal-sm">
				<div className="modal-content">
					<div className="modal-header">
	        			<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        			<h4 className="modal-title" id="myModalLabel">{this.props.title}</h4>
	      			</div>
	      			<div className="modal-body">
	        			{this.props.message}
	      			</div>
	      			<div className="modal-footer">
	        			<button type="button" className="ilv-btn ilv-btn-sm ilv-btn-clean" data-dismiss="modal">
                            {Messages.get("ActionCancel")}
                        </button>
	        			<button type="button" className="ilv-btn ilv-btn-sm ilv-btn-primary" onClick={this.props.onConfirm}>
                            {Messages.get("ActionConfirm")}
                        </button>
	      			</div>
				</div>
			</div>
		);
	}
});

var DeleteConfirmModal = createClass({
	getDefaultProps() {
		return {
			text: "Você tem certeza que deseja excluir este registro?",
			confirmText: "Excluir",
			declineText: "Cancelar"
		};
	},
	render() {
		return (
			<div className="modal-dialog modal-sm">
				<div className="modal-content">
					<div className="modal-header ilevus-modal-header">
	        			<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        			<h4 className="modal-title" id="myModalLabel">Atenção</h4>
	      			</div>
	      			<div className="modal-body ilevus-modal-body">
	        			<p>{this.props.text}</p>
	      			</div>
	      			<div className="modal-footer ilevus-modal-footer">
	        			<button type="button" className="btn btn-sm btn-default" data-dismiss="modal">{this.props.declineText}</button>
	        			<button type="button" className="btn btn-sm btn-primary" onClick={this.props.onConfirm}>{this.props.confirmText}</button>
	      			</div>
				</div>
			</div>
		);
	}
});

var ReadTextModal = createClass({
	onConfirmWrapper(evt) {
		var me = this,
			value = me.refs['text-input'].value;
		_.defer(() => {
			me.props.onConfirm(value);
		});
	},
	render() {
		return (
			<div className="modal-dialog modal-sm">
				<div className="modal-content">
					<div className="modal-header">
	        			<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        			<h4 className="modal-title" id="myModalLabel">{this.props.title}</h4>
	      			</div>
	      			<div className="modal-body">
	        			<p>{this.props.message}</p>
	        			<input type='text' className='form-control' ref="text-input" />
	      			</div>
	      			<div className="modal-footer">
	        			<button type="button" className="btn btn-sm btn-default" data-dismiss="modal">Cancelar</button>
	        			<button type="button" className="btn btn-sm btn-primary" onClick={this.onConfirmWrapper}>Confirmar</button>
	      			</div>
				</div>
			</div>
		);
	}
});

var FileUploadModal = createClass({
	render() {
		return (
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
	        			<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        			<h4 className="modal-title" id="myModalLabel">{this.props.title}</h4>
	      			</div>
	      			<div className="modal-body">
	        			<div>{this.props.message}</div>
	        			<input type='file' name="file" className='form-control' ref="file-upload-field" id="file-upload-field" />
	        		</div>
	        		<div className="panel-footer">
	        			<div id="file-upload-progress" className="progress" style={{border: '1px solid #ccc'}}>
		        			<div className="progress-bar progress-bar-success"></div>
		    			</div>
	    			</div>
				</div>
			</div>
		);
	}
});

var LargeContentModal = createClass({
    render() {
        return <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">{this.props.title}</h4>
              </div>
              <div className="modal-body">
                {this.props.children}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Ok</button>
              </div>
            </div>
        </div>;
    }
});

var MediumModal = createClass({
	getDefaultProps() {
		return {
			title: null
		};
	},
	render() {
		return (
			<div className="modal-dialog modal-md">
				<div className="modal-content">
					<div className="modal-header ilevus-modal-header">
	        			<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        			<h4 className="modal-title" id="myModalLabel">{this.props.title}</h4>
	      			</div>
	      			<div className="modal-body ilevus-modal-body">
	        			{this.props.children}
	      			</div>
				</div>
			</div>
		);
	}
});

var Modal = {
	$el: EL,
	hide() {
		$(this.$el).modal("hide");
		_.defer(() => {
			ReactDOM.render((
				<div></div>
			),this.$el);
		});
	},
	show() {
		$(this.$el).modal("show");
	},
	detailsModal(title, Components) {
		ReactDOM.render((
			<MediumModal title={title}>
				{Components}
			</MediumModal>
		),this.$el);
		$(this.$el).modal('show');
	},
	largeModal(title, Components) {
		ReactDOM.render((
			<LargeContentModal title={title}>
				{Components}
			</LargeContentModal>
		),this.$el);
		$(this.$el).modal('show');
	},
	alert(title, msg) {
		ReactDOM.render((
			<AlertModal title={title} message={msg} />
		),this.$el);
		$(this.$el).modal('show');
	},
	confirm(title, msg, cb) {
		ReactDOM.render((
			<ConfirmModal onConfirm={cb}  title={title} message={msg} />
		),this.$el);
		$(this.$el).modal('show');
	},
	deleteConfirm(cb) {
		ReactDOM.render((
			<DeleteConfirmModal onConfirm={cb} />
		),this.$el);
		$(this.$el).modal('show');
	},
	readText(title, msg, cb) {
		ReactDOM.render((
			<ReadTextModal title={title} message={msg} onConfirm={cb} />
		),this.$el);
		$(this.$el).modal('show');
	},

	uploadFile(title, msg, url, onSuccess, onFailure) {
		var me = this;
		ReactDOM.render((
			<FileUploadModal title={title} message={msg} />
		),this.$el);
		this.show();

		$('#file-upload-field').fileupload({
	        url: url,
	        dataType: 'json',
	        done: function (evt, xhr) {
	            if ((evt.type == 'fileuploaddone')) {
	                if (typeof onSuccess == 'function')
	                    onSuccess.call(me, evt, xhr);
	            } else {
	                if (typeof onFailure == 'function')
	                    onFailure.call(me, evt, xhr);
	            }
	        },
	        error: function (arg1, arg2) {
	            if (typeof onFailure == 'function')
	                onFailure.call(me, arg1, arg2);
	        },
	        progressall: function (e, data) {
	            var progress = parseInt(data.loaded / data.total * 100, 10);
	            $('#file-upload-progress .progress-bar').css(
	                'width',
	                progress + '%'
	            );
	        }
	    }).prop('disabled', !$.support.fileInput)
	        .parent().addClass($.support.fileInput ? undefined : 'disabled');
	}
};

module.exports = Modal;
