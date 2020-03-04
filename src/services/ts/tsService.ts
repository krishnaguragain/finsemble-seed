const Finsemble = require('@chartiq/finsemble');

Finsemble.Clients.Logger.start();
Finsemble.Clients.Logger.log('TsService starting up');

export default class tsService extends Finsemble.baseService {
    constructor() {
        super({
            // add any services or clients that should be started before your service
            startupDependencies: {
                services: [],
                clients: []
            }
        });

        this.readyHandler = this.readyHandler.bind(this);
        this.onBaseServiceReady(this.readyHandler);
    }

    readyHandler(callback: Function) {
        this.createRouterEndpoints();
        Finsemble.Clients.Logger.log('TsService is ready.');
        callback();
    }

    createRouterEndpoints() {
        /*
        Example router integration which uses a single query responder to expose multiple functions
        */
        Finsemble.Clients.RouterClient.addResponder('ts functions', this.responderCb);
    }

    responderCb(error: any, queryMessage) {
        if (!error) {
            Finsemble.Clients.Logger.log('ts Query: ' + JSON.stringify(queryMessage));
            if (queryMessage.data.query === 'myFunction') {
                try {
                    queryMessage.sendQueryResponse(null, 'Response');
                } catch (err) {
                    queryMessage.sendQueryResponse(err);
                }
            } else {
                queryMessage.sendQueryResponse('Unknown ts query function: ' + queryMessage, null);
                Finsemble.Clients.Logger.error('Unknown ts query function: ', queryMessage);
            }
        } else {
            Finsemble.Clients.Logger.error('Failed to setup ts query responder', error);
        }
    }
}
const serviceInstance = new tsService();
serviceInstance.start();
module.exports = serviceInstance;
