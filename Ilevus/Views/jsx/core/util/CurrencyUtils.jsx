function format(value, localization) {
	// TODO: Fazer para todas as linguas.
    var retorno = "";

    if (value !== "NaN")
        retorno = "R$ " + value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
        
    return retorno;
}

module.exports = {
	format: format
};
