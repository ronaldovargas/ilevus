function format(value, localization) {
	// TODO: Fazer para todas as linguas.
	return "R$ " + value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
}

module.exports = {
	format: format
};
