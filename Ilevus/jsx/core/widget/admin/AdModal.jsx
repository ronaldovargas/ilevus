var _ = require('underscore');
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var EL = document.getElementById("main-global-modal");

var FileUploadModalAd = React.createClass({
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

var ModalAd = {
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
    mostrar(title, msg, targetField) {
        var me = this;
        ReactDOM.render((
			<FileUploadModalAd title={title} message={msg} />
		),this.$el);
        this.show();


        $('#file-upload-field').change(function(){
            //alert('change image!');
            
            var file = jQuery(this)[0].files[0];
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                jQuery("#lbl_" + targetField).text(file.name);
                jQuery("#" + targetField).val(reader.result);
                //console.log(reader.result);
            };
            reader.onerror = function (error) {
                jQuery("lbl_" + targetField).text("");
                jQuery("#" + targetField).val("");
                //console.log('Error: ', error);
            };
            me.hide();
        });
    }
};

module.exports = ModalAd;