
var _ = require("underscore");
var S = require("string");
var marked = require("marked");
var React = require('react');
var Radar = require('react-chartjs-2').Radar;

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

const data = {
    labels: ['Pessoal', 'Trabalho', 'Estudo', 'Filhos', 'Lazer'],
    datasets: [
      {
          label: 'Desempenho',
          backgroundColor: 'rgba(179,181,198,0.2)',
          borderColor: 'rgba(179,181,198,1)',
          pointBackgroundColor: 'rgba(179,181,198,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(179,181,198,1)',
          data: [10, 6, 4, 2, 7]
      }
    ]
};

module.exports = React.createClass({
    propTypes: {
    },
    getDefaultProps() {
        return {
        };
    },
    getInitialState() {
        return {
        };
    },

    render() {
        return <Radar data={data} />;
    }
});