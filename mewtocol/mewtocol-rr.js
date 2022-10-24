const MewClient = require('jsmewtocol');
module.exports = function(RED) {
    function MewtocolRR(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            node.server = RED.nodes.getNode(config.server);
            var mewclient = new MewClient(node.server.host, node.server.port, node.server.timeout);
            node.status({fill:"green",shape:"dot",text:"connected"});
            var station = msg.station?msg.station:config.station;
            var startaddress=msg.startaddress?msg.startaddress:config.startaddress;
            var endaddress=msg.endaddress?msg.endaddress:config.endaddress;
            if (!(station && startaddress && endaddress)) {
                node.status({fill:"red",shape:"dot",text:"missing parameters"});
                node.error((config.name||"mewtocol-rr")+": Missing parameters");
                return;
            }
            mewclient.RR(station,startaddress,endaddress)
            .then(function(data){
                msg.payload=data;
                node.send([msg,null]);
                node.status({fill:"grey",shape:"ring",text:"disconnected"});
                return mewclient.destroy();
            })
            .catch(function(err){
                node.send([null,err]);
                node.status({fill:"red",shape:"dot",text:"error"});
                node.error(err);
                return mewclient.destroy();
            });
        });
    }
    RED.nodes.registerType("mewtocol-rr",MewtocolRR);
}