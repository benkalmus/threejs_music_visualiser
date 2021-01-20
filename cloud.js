
//Creates a spiral of clouds and rotates them.
var clouds = [];
let cloudLights = [];
var cloudMaxSize = 350;
var cloudDistZ = -700;
var furthest = 0;

var sceneClouds;
var dirLight;
var ambient;

function initClouds() 
{
    
    sceneClouds = new THREE.Scene();
    //light
    ambient = new THREE.AmbientLight(0x555555);
    sceneClouds.add(ambient);
    dirLight = new THREE.DirectionalLight(0x777777);
    dirLight.position.set(0, 0, 1);
    sceneClouds.add(dirLight);
    //lighting for changing the colour of clouds.
    cloudLights[0] = new THREE.PointLight(0x34f200, 10, 1000 , 2.9);      //green
    cloudLights[0].position.set(0, 0, (Math.random() * 200 )+cloudDistZ);
    cloudLights[1] = new THREE.PointLight(0xff0000, 100, 1000 , 2.9);  //red
    cloudLights[1].position.set(0, 0, (Math.random() * 200 )+cloudDistZ*2);
    cloudLights[2] = new THREE.PointLight(0x2135ff, 10, 1000 , 2.9);  //blue
    cloudLights[2].position.set(0 , 0,  (Math.random() * 200 )+cloudDistZ*0.5 );

    for(let i = 0; i< cloudLights.length; i++ )
    {
        sceneClouds.add(cloudLights[i]);
    }

    sceneClouds.fog = new THREE.FogExp2(0x0e1a52, 0.0009);
    renderer.setClearColor(sceneClouds.fog.color);

    var textureLoader = new THREE.TextureLoader();
    textureLoader.load("smoke1.png", function(texture)     //use smoke image as texture for clouds
    {
        cloudGeo = new THREE.PlaneBufferGeometry(cloudMaxSize, cloudMaxSize); //geometry instance
        cloudMaterial = new THREE.MeshLambertMaterial({     
            //color: 0xffffff,
            //clipShadows: false,
            side: THREE.DoubleSide,
            map:texture,
            flatShading:true,
            transparent: true
        });
        var radius  =20;
        cloudDistZ  = -700;
        var end = 5.0;
        //spiral equation
        for (var p=1.5*Math.PI; p<end*Math.PI; p+= Math.PI/64) {
            var cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
            var x = radius * p * Math.cos(6*p );
            var y = radius * p * Math.sin(6*p );
            var z = ((p - end*Math.PI)*200) - 10;
            if (z < furthest) furthest = z;
            cloud.position.set(x, y, z);
            cloud.rotation.z = Math.random() *360;
            clouds.push(cloud); 
            sceneClouds.add(cloud);
        }

    });
   
}
clock = new THREE.Clock();


//rendering loop
function renderClouds() 
{
    var delta = clock.getDelta();
    clouds.forEach(c => {
        c.rotation.z -= delta * 0.1;
        //move spiral towards user.
        //c.position.z += delta*20;
        // if (c.position.z >= 0)
        //    c.position.z = furthest;
    });
}