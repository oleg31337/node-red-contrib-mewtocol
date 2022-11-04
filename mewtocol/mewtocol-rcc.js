const MewClient = require('jsmewtocol');
module.exports = function(RED) {
    function MewtocolRCC(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            node.server = RED.nodes.getNode(config.server);
            var mewclient = new MewClient(node.server.host, node.server.port, node.server.timeout);
            mewclient.on('connect', ()=>{
                node.status({fill:"green",shape:"dot",text:"connected"});
            });
            mewclient.on('error', ()=>{
                node.status({fill:"red",shape:"dot",text:"error"});
            });
            var station = msg.station?msg.station:config.station;
            var area = msg.area?msg.area:config.area;
            var startaddress=msg.startaddress?msg.startaddress:config.startaddress;
            var endaddress=msg.endaddress?msg.endaddress:config.endaddress;
            if (!(station && area && startaddress && endaddress)) {
                node.status({fill:"red",shape:"dot",text:"missing parameters"});
                node.error((config.name||"mewtocol-rcc")+": Missing parameters");
                return;
            }
            mewclient.RCC(station,area,startaddress,endaddress)
            .then(function(data){
                msg.payload=data;
                node.send([msg,null]);
                node.status({});
                return mewclient.destroy();
            })
            .catch(function(err){
                if (config.sendonerror){
                    msg.payload="";
                    node.send([msg,err]);
                }
                else {
                    node.send([null,err]);
                }
                node.status({fill:"red",shape:"dot",text:"error"});
                node.error(err);
                return mewclient.destroy();
            });
        });
    }
    RED.nodes.registerType("mewtocol-rcc",MewtocolRCC);
}