let formatString = (str, ...args) => {
    return str.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
};

module.exports = {formatString};
