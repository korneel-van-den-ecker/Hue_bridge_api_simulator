'use strict';

const Hapi = require('@hapi/hapi');
const fs = require('fs');

let rawligth_response = fs.readFileSync('lights_response.json');
let lights = JSON.parse(rawligth_response);

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    //Hello World Route
    server.route({
        method: 'GET',
        path: '/',
        handler: (request , h) => {
            
            return 'Hello World!';
        }
    });

    
    server.route({
        method:'GET',
        path:'/api/{id}/lights/{nummer}',
        handler: (request,h) =>{
            const params = request.params || {}

            if(params.id){
                console.log("hallooeee "  + lights.lenght);    
                return lights[params.nummer];
            }
        }
    })

    server.route({
        method:'GET',
        path:'/api/{id}/lights',
        handler: (request,h) =>{
            const params = request.params || {}

            if(params.id){
                return lights;
            }
        }
    })


    server.route({
        method:'PUT',
        path:'/api/{id}/lights/{nummer}/state',
        handler: (request,h) =>{
            const params = request.params || {}
            const payload = request.payload;
            if(params.id && params.nummer){
                lights[params.nummer].state.on = payload.on;
                let data = JSON.stringify(lights);
                fs.writeFileSync('lights_response.json',data);
                

                return lights[params.nummer].state;
            }
        }
    })

 


    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();