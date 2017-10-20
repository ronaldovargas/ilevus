var _ = require('underscore');
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var Modal = require("ilevus/jsx/core/widget/admin/AdModal.jsx");

var EL = document.getElementById("main-global-modal");

var AlertModal = React.createClass({
    render() {
        return (
			<div className="modal-dialog modal-sm">
				<div className="modal-content">
					<div className="modal-header">
	        			<a className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a>
	        			<h4 className="modal-title" id="myModalLabel">{this.props.title}</h4>
					</div>
	      			<div className="modal-body">{this.props.message}
	      			</div>
	      			<div className="modal-footer">
	        			<button type="button" className="ilv-btn ilv-btn-primary ilv-btn-sm" data-dismiss="modal">Ok</button>
	      			</div>
				</div>
			</div>
		);
    }
});

var FileUploadModalAd = React.createClass({
    render() {
        return (
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
	        			<button type="button" id="modalAdClose" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        			<h4 className="modal-title" id="myModalLabel">{this.props.title}</h4>
					</div>
	      			<div className="modal-body">
	        			<div>{this.props.message}</div>
	        			<input type='file' name="file" className='form-control' ref="file-upload-field" id="file-upload-field" />
                          <span className="text-danger" id="spErrorImage"></span>
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
        $(this.$el).modal({
            backdrop: 'static',
            keyboard: false
        });
    },

    alert(title, msg) {
        ReactDOM.render((
			<AlertModal title={title} message={msg} />
		),this.$el);
        $(this.$el).modal('show');
    },

    mostrar(limit_size, title, msg, targetField, isModal) {
        var me = this;
        ReactDOM.render((
			<FileUploadModalAd limit_size={limit_size} isModal={isModal} title={title} message={msg} />
		),this.$el);
        this.show();

        $("#modalAdClose").click(function () {
            me.hide();
        });

        $('#file-upload-field').change(function(){

            var uplField = this;

            var file = jQuery(uplField)[0].files[0];

            if (file.size / 1024 > limit_size) {
                var txtErro = Messages.get("LabelErrorAdImageSize");
                txtErro = txtErro.replace("{0}", limit_size + "Kb")
                jQuery("#spErrorImage").html("<b>" + txtErro + "</b>");
                jQuery(uplField).val("");
            } else {
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {

                    var tmpImg = new Image();
                    tmpImg.src = window.URL.createObjectURL(file);

                    tmpImg.onload = function () {
                        if (!isModal && (tmpImg.naturalWidth != 240 || tmpImg.naturalHeight != 475)) {
                            var txtErro = "";
                            txtErro = Messages.get("TextAdImageMaxSize").replace("{0}", "240px X 475px");
                            jQuery("#spErrorImage").html("<b>" + txtErro + "</b>");
                            jQuery(uplField).val("");
                            return false;
                        } else if (isModal && (tmpImg.naturalWidth != 280 || tmpImg.naturalHeight != 115)) {
                            var txtErro = "";
                            txtErro = Messages.get("TextAdImageMaxSize").replace("{0}", "280px X 115px");
                            jQuery("#spErrorImage").html("<b>" + txtErro + "</b>");
                            jQuery(uplField).val("");
                            return false;
                        } else {
                            if ($("#lbl_" + targetField + " img").length > 0) {
                                var img = $("#lbl_" + targetField + " img");
                                img.attr('src', e.target.result);
                            } else {
                                var img = $("<img>");
                                img.attr('src', e.target.result).css("width", "150px");
                                img.appendTo("#lbl_" + targetField);
                            }

                            jQuery("#" + targetField).val(reader.result);

                            me.hide();
                        }
                    }
                    

                };
                reader.onerror = function (error) {
                    jQuery("lbl_" + targetField).text("");
                    jQuery("#" + targetField).val("");

                    me.hide();
                };
                
            }

        });
    }
};

module.exports = ModalAd;