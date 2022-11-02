const MewClient = require('jsmewtocol');
module.exports = function(RED) {
    function MewtocolRT(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            node.server = RED.nodes.getNode(config.server);
            var mewclient = new MewClient(node.server.host, node.server.port, node.server.timeout);
            mewclient.on('connect', ()=>{
                node.status({fill:"green",shape:"dot",text:"connected"});
            });
            mewclient.on('disconnect', ()=>{
                node.status({fill:"grey",shape:"ring",text:"disconnected"});
            });
            mewclient.on('error', ()=>{
                node.status({fill:"red",shape:"dot",text:"error"});
            });
            var station = msg.station?msg.station:config.station;
            if (!station) {
                node.status({fill:"red",shape:"dot",text:"missing parameters"});
                node.error((config.name||"mewtocol-rt")+": Missing parameters");
                return;
            }
            mewclient.RT(station)
            .then(function(data){
                msg.payload=data;
                node.send([msg,null]);
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
    RED.nodes.registerType("mewtocol-rt",MewtocolRT);
}