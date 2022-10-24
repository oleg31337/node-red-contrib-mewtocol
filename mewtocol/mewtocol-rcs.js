const MewClient = require('jsmewtocol');
module.exports = function(RED) {
    function MewtocolRCS(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            node.server = RED.nodes.getNode(config.server);
            var mewclient = new MewClient(node.server.host, node.server.port, node.server.timeout);
            node.status({fill:"green",shape:"dot",text:"connected"});
            var station = msg.station?msg.station:config.station;
            var area = msg.area?msg.area:config.area;
            var address=msg.address?msg.address:config.address;
            if (!(station && area && address)) {
                node.status({fill:"red",shape:"dot",text:"missing parameters"});
                node.error((config.name||"mewtocol-rcs")+": Missing parameters");
                return;
            }
            mewclient.RCS(station,area,address)
            .then(function(data){
                msg.payload=data;
                node.send([msg,null]);
                node.status({fill:"grey",shape:"ring",text:"disconnected"});
                return mewclient.destroy();
            })
            .catch(function(err){
                node.send[null,err];
                node.status({fill:"red",shape:"dot",text:"error"});
                node.error(err);
                return mewclient.destroy();
            });
        });
    }
    RED.nodes.registerType("mewtocol-rcs",MewtocolRCS);
}