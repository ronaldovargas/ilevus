var _ = require("underscore");

module.exports = {
    sendPhoneRequestEvent() {
        if (typeof ga != "undefined")
            ga('send', 'event', "Button", "PhoneRequest");
        else
            console.warn("Analytics not found.");
    }
};
