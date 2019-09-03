var path = require('path');

module.exports = {
    mode: 'development',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    externals: {
        // global app config object
        config: JSON.stringify({
            apiUrl: 'http://199.172.1.76:8080/aahung-aagahi/api'
        })
    }
}