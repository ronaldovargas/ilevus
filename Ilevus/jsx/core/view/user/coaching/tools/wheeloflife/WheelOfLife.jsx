var React = require("react");
var Link = require("react-router").Link;
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var Radar = require('react-chartjs-2').Radar;

const data = {
    labels: ['Pessoal', 'Trabalho', 'Estudo', 'Família', 'Filhos', 'Lazer'],
    datasets: [
      {
          label: 'Nota',
          backgroundColor: "rgba(103, 58, 183, 0.2)",
          borderColor: 'rgba(103, 58, 183,1)',
          pointBackgroundColor: '#fff',
          pointBorderColor: 'rgba(103, 58, 183,1)',
          ointHoverBackgroundColor: 'rgba(103, 58, 183,1)',
          pointHoverBorderColor: 'rgba(103, 58, 183,1)',
          data: [10, 6, 8, 0, 0, 0]
      }
    ]
};

module.exports = React.createClass({
    render() {
        return (
            <div className="container my-5">
                <div className="row mb-5">
                    <div className="col-12 mb-5">
                        <div className="ilv-media">
                            <div className="ilv-media-body">
                                <h1>{Messages.get("LabelWheelOfLife")}</h1>
                            </div>
                            <div className="ilv-media-right">
                                <button className="ilv-btn ilv-btn-primary">{Messages.get("LabelFinish")}</button>
                                <button className="ilv-btn">{Messages.get("LabelSaveDraft")}</button>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <h3 className="mb-3">{Messages.get("LabelField")}: {Messages.get("LabelFamily")}</h3>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelQuestions")}</label>
                            <ul>
                                <li>Tempo dedicado à família?</li>
                                <li>Momentos agradáveis e amistosos com a família?</li>
                                <li>Diálogo e boa vontade para resolver conflitos?</li>
                                <li>Grau de abertura para falar?</li>
                                <li>Confiança e apoio mútuos?</li>
                            </ul>
                        </div>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelScore")}</label>
                            <input className="ilv-form-control" type="number" max="10" min="0" />
                        </div>
                        <a className="font-weight-bold mr-4" href="#">&#8592; {Messages.get("LabelPrevious")}</a>
                        <a className="font-weight-bold" href="#">{Messages.get("LabelNext")} &#8594;</a>
                    </div>
                    <div className="col mb-3">
                        <Radar data={data} />
                    </div>
                </div>
                <hr className="mb-5" />
                <div className="row mb-5">
                    <div className="col">
                        <h4>{Messages.get("LabelTasks")}</h4>
                        <table className="ilv-table">
                            <thead>
                                <tr>
                                    <th>{Messages.get("LabelDescription")}</th>
                                    <th width="160">{Messages.get("LabelField")}</th>
                                    <th width="160">{Messages.get("LabelDeadline")}</th>
                                    <th width="140"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Fazer check-up anual</td>
                                    <td>Saúde</td>
                                    <td>Fev / 2017</td>
                                    <td className="text-right">
                                        <button className="ilv-btn ilv-btn-sm ilv-btn-clean mx-0">
                                            <i className="ilv-icon material-icons md-18">&#xE3C9;</i>
                                        </button>
                                        <button className="ilv-btn ilv-btn-sm ilv-btn-clean mx-0">
                                            <i className="ilv-icon material-icons md-18">&#xE5C9;</i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Ler livros sobre finanças</td>
                                    <td>Finanças</td>
                                    <td>Mar / 2017</td>
                                    <td className="text-right">
                                        <button className="ilv-btn ilv-btn-sm ilv-btn-clean mx-0">
                                            <i className="ilv-icon material-icons md-18">&#xE3C9;</i>
                                        </button>
                                        <button className="ilv-btn ilv-btn-sm ilv-btn-clean mx-0">
                                            <i className="ilv-icon material-icons md-18">&#xE5C9;</i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        <a className="font-weight-bold" href="javascript:;">+ {Messages.get("LabelAddTask")}</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col-12">
                        <div className="ilv-form-group">
                            <h4>{Messages.get("LabelLearning")}</h4>
                            <textarea className="ilv-form-control" placeholder={Messages.get("PlaceholderDescribeYourWhatYouLearned")}></textarea>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});