
var React = require("react");
var S = require("string");
var Toastr = require("toastr");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    propTypes: {
        user: React.PropTypes.object.isRequired
    },
    getDefaultProps() {
        return {
            user: null
        };
    },
    getInitialState() {
        return {
        };
    },

    render() {
        return <div>
                            <table className="ilv-schedule">
                                <thead>
                                    <tr>
                                        <th width="45">
                                            <a href="#">
                                                <i className="material-icons md-36">&#xE314;</i>
                                            </a>
                                        </th>
                                        <th>
                                            <div className="">Hoje</div>
                                            <div className="">12 dez</div>
                                        </th>
                                        <th>
                                            <div className="">Terça</div>
                                            <div className="">13 dez</div>
                                        </th>
                                        <th>
                                            <div className="">Quarta</div>
                                            <div className="">14 dez</div>
                                        </th>
                                        <th>
                                            <div className="">Quinta</div>
                                            <div className="">15 dez</div>
                                        </th>
                                        <th>
                                            <div className="">Sexta</div>
                                            <div className="">16 dez</div>
                                        </th>
                                        <th width="45">
                                            <a href="#">
                                                <i className="material-icons md-36">&#xE5CC;</i>
                                            </a>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <a href="#">09:00</a>
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <a href="#">09:30</a>
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <a href="#">10:00</a>
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <a href="#">10:30</a>
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            ...
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <a href="#">mais</a>
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
        </div>;
    }
});
