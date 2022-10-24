//node-red mewtocol config module
module.exports = function(RED) {
    function MewtocolClientNode(config) {
        RED.nodes.createNode(this,config);
        this.name = config.name;
        this.host = config.host;
        this.port = parseInt(config.port);
        this.timeout = parseInt(config.timeout);
    }
    RED.nodes.registerType("mewtocol-client",MewtocolClientNode);
}