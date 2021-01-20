//produces the flying orbs effect.
var pointGeometry, sprite, pointsMaterial;
var sizeGeometry = 500;     //size of cube where the warp effect is active
var maxPosition = 100;     //position where the warp points are reset to random positions.
var spinSpeed = 0.0025;
var warpObj;
var multiplier = 1;

function initWarp() 
{
    pointGeometry = new THREE.Geometry();   //more efficient to render one geometry with many vertices rather than many geometries each with only one vertex. This allows vast particle generation
    for(let i = 0; i < 500; i++ )
    {
        //create a new point in a random location
        var point = new THREE.Vector3( Math.random() * sizeGeometry-(sizeGeometry/2), Math.random() * sizeGeometry-(sizeGeometry/2), Math.random() * sizeGeometry-(sizeGeometry/2));
        point.velocity =0;
        point.acceleration =0.005;
        pointGeometry.vertices.push(point); //add point to the geometry.
    }
    sprite = new THREE.TextureLoader().load('warp.png');        //can be any image, a flat circle in this case, to create the warp effect
    pointsMaterial = new THREE.PointsMaterial({ 
        color:0xffa9a9,
        size:3,
        map: sprite,
        transparent: true
    });

    warpObj = new THREE.Points(pointGeometry, pointsMaterial);
    sceneClouds.add(warpObj);
}

//rendering loop
function renderWarp() 
{
    pointGeometry.vertices.forEach(point => {
        point.velocity += point.acceleration * deltaT * multiplier;
        point.z += point.velocity;
        if(point.z >= maxPosition)
        {
            point.z = -sizeGeometry;
            point.velocity = Math.random()*5 + 1;
        }
    });
    var s = spinSpeed * deltaT * 0.8;
    warpObj.rotation.z -= s;      

    pointGeometry.verticesNeedUpdate = true;
}