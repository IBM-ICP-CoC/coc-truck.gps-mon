const random = require('random');

const appVersion = "1.0.0";

const DEVICE_ID=process.env.HZN_DEVICE_ID;

console.log('coc-truck.gps-mon Simulator');
console.log(`Version: ${appVersion}`  );
console.log(`Device: ${DEVICE_ID}`  );

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

// initial conditions
var lat = 39.952583 + random.float(min = -1, max = 1);
var lon = -75.165222 + random.float(min = -1, max = 1);
 
var direction = random.int(min = 0, max = 359);

var distribution = random.normal(mu = 55, sigma = 20);
var speed = distribution();

const r_earth = 3963; // radius of earth in miles

function updateLocation( dx, dy ) {
    var new_latitude  = lat  + (dy / r_earth) * (180 / Math.PI);
    var new_longitude = lon + (dx / r_earth) * (180 / Math.PI) / Math.cos(lat * Math.PI/180);
    lat = new_latitude;
    lon = new_longitude;
}

var readingTimestamp = Date.now();

function updateData(){

    var timestamp = Date.now();

    speed = distribution();

    var dt = Math.floor( ( timestamp - readingTimestamp )/1000 ); // time in seconds since last reading
    if( dt > 0 ) {
        var distance = speed * dt / 60 / 60;
        var dx = distance * Math.cos( deg2rad(direction) );
        var dy = distance * Math.sin( deg2rad(direction) );
        
        updateLocation( dx, dy );
    }
}

function changeDirection(){
    var die = random.int(min = 1, max = 3);  // 1 left, 2 straight, 3 right
    switch( die ) {
        case 1: direction -= 90;
                break;
        case 3: direction += 90;
                break; 
    }
}

function sendToHub(){

    data = {
        "lat": lat,
        "lon": lon,
        "direction": direction,
        "speed": speed,
        "time": new Date()
    }

    console.log( JSON.stringify(data,null,4) );

}

function update(){
    updateData();
    sendToHub();
}

updateData();
sendToHub();

setInterval(changeDirection, 5*60*1000); // every 5 min
setInterval(update,60*1000); // every min
