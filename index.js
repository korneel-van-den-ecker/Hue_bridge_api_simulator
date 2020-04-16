'use strict';

const Hapi = require('@hapi/hapi');
const fs = require('fs');

let rawligth_response = fs.readFileSync('lights_response.json');
let lights = JSON.parse(rawligth_response);

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: true
        }
        
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request , h) => {
            
            return 'This API works!';
        }
    });
    
    server.route({
        method:'GET',
        path:'/api/{id}/lights/{nummer}',
        handler: (request,h) =>{
			return getLightById(request, h);
        }
    })

    server.route({
        method:'GET',
        path:'/api/{id}/lights/{nummer}/',
        handler: (request,h) =>{
			return getLightById(request, h);
        }
    })

    server.route({
        method:'GET',
        path:'/api/{id}/lights',
        handler: (request,h) =>{
			return getAllLights(request, h);
		}
    })

    server.route({
        method:'GET',
        path:'/api/{id}/lights/',
        handler: (request,h) =>{
			return getAllLights(request, h);
        }
    })

    server.route({
        method:'PUT',
        path:'/api/{id}/lights/{nummer}/state',
        handler: (request,h) =>{
			return updateState(request, h);
        }
    })

    server.route({
        method:'PUT',
        path:'/api/{id}/lights/{nummer}/state/',
        handler: (request,h) =>{
			return updateState(request, h);
        }
    })

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

function getLightById(request, h) {
	const params = request.params || {}
	
	if(params.id){
		console.log("hallooeee "  + lights.lenght);    
		return lights[params.nummer];
	}
}

function getAllLights(request, h) {
	const params = request.params || {}
	
	if(params.id){
		return lights;
	}
}

function updateState(request, h) {
	const params = request.params || {}
	const payload = request.payload;
	console.log("je bent bij state aanpassen" + params.id +" en " + params.nummer);
	
	if(params.id && params.nummer){
		// Als het over de on param gaat
		console.dir("payload.on: " + payload)

		let keys = Object.keys(payload);
		console.log("aantal params: " + keys);

		if(payload.on != null){
			lights[params.nummer].state.on = payload.on;
			console.log("je bent bij de on param");
		}
		
		// Als het over de kleur param gaat
		if(payload.xy != null){
			lights[params.nummer].state.xy = payload.xy;
			console.log("je bent bij de on param");
		}
		
		// Data terug opslaan in bestand
		let data = JSON.stringify(lights);
		fs.writeFileSync('lights_response.json',data);               

		return lights[params.nummer].state;
	}
}

init();
