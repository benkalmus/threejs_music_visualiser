const PI = Math.PI;
const HALF_PI = Math.PI/2;
var last=0.0, deltaT =0.01;
const uplStorage = "/uploads/";
//PERF MONITOR, uncomment to see fps and frametime information
//javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

//jquery 
$(document).ready(function(){
    //handle ajax file upload
    $('#uploadButton').click(function(){
        var formData = new FormData($(".uploadMusic").get(0));
        var file = $('#fileElem').file;
        formData.append('file', file);

        $.ajax({
            type: "POST",
            url: '/uploadfile',
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function(res){
                if (res){
                    //successful callback
                    console.log('File uploaded');
                    $('#audioFile').attr("src", uplStorage + res.filename);   
                    audioHTML.play();
                    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
                }else{
                    console.log('File could not be uploaded');
                }
            },
            error:function(e)
            {
                console.log("error during upload");
            }
        });
        event.preventDefault();

    });
    $('#play').click(function(){
        audioHTML = document.getElementById("audioFile");
        audioHTML.play();
        ctx.resume();
        audioPlaying = true;
        $("html, body").animate({ scrollTop: $(document).height() }, "slow");
    });
    $('#pause').click(function(){
        audioHTML = document.getElementById("audioFile");
        audioHTML.pause();
        audioPlaying = false;
    });

    $('form input').change(function () {
        $('form p').text(this.files[0].name + " selected");
    });

});

//audio init
var ctx = new AudioContext();
var audioHTML = document.getElementById("audioFile");
var audioSrc = ctx.createMediaElementSource(audioHTML);
var analyser = ctx.createAnalyser();
analyser.fftSize = 1024;
audioSrc.connect(analyser);
audioSrc.connect(ctx.destination);
var freqData = new Uint8Array(analyser.frequencyBinCount);
audioHTML.volume =1;
var audioPlaying = false;

/*      GLOBALS      */
var scene, camera, renderer, composer;
var lights = [];
var mouse = new THREE.Vector2();

function initScene()
{

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
    //camera.far = 0;
    camera.position.z = 100;
    camera.updateProjectionMatrix();
    renderer = new THREE.WebGLRenderer({antialias: true});
    //renderer.setClearColor("#e5e5e5");
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement); 
    window.addEventListener('resize', () => {           //resize event
        renderer.setSize(window.innerWidth,window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    })
    renderer.autoClear= false;
    renderer.setClearColor(0x000000, 1)
}


initScene();
//var controls = new THREE.OrbitControls( camera, renderer.domElement );
var geometry = new THREE.Geometry();
var material = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    flatShading: false,
    //side: THREE.DoubleSide,
    side: THREE.FrontSide,
    wireframe: false,
    transparent: false,
    vertexColors: THREE.FaceColors // to colour-in faces
});


var lineMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    vertexColors: THREE.VertexColors
});

var mesh = new THREE.Line(geometry, lineMat);
//mesh.renderOrder = 99;


var buildTime = performance.now();
analyser.getByteFrequencyData(freqData);
audioHTML.volume = 0.3;
// if (disp.autoPlay) //debug gui
// {
//     audioHTML.play();
//     audioPlaying = true;
// }
// generateShape(disp.F1m, disp.F1n1, disp.F1n2, disp.F1n3, disp.F2m, disp.F2n1,  disp.F2n2, disp.F2n3);
generateShape(-7.2, 3, -3, -3, -3, -3,  -3, -3);
renderGeometry(geometry);
initClouds();
initWarp();
scene.add(mesh);
//init 
var avgData = [];
for (let i=0; i< 10; i++) avgData[i] = 0;
var hu = 0;
var rotationZ = 0;
const deg2rad = Math.PI/180;
//smoothly rotating object
var rotFlatView = {x: 0, y:0};
var rotSideView = {x:  90*deg2rad, y: -90*deg2rad};
var rotTopView = {x:  90*deg2rad, y: 180*deg2rad};
var rotAngleView = {x: -45*deg2rad, y: -45*deg2rad};
var rotAngleView2 = {x: 45*deg2rad, y: 45*deg2rad};
var views = [rotFlatView, rotSideView, rotTopView, rotAngleView, rotAngleView2];
var currentView = 0;
var tween = new TWEEN.Tween(mesh.rotation)
            .to( rotFlatView, 1000)
            .delay(400)
            .easing(TWEEN.Easing.Quadratic.Out);
var camIn = {z: 30};
var camOut = {z: 200};
var camTween = new TWEEN.Tween(camera.position)
            .to( camIn, 5000)
            .delay(400)
            .easing(TWEEN.Easing.Quadratic.Out);
var lastTweenTime = 0;
render();
function render(ts) 
{
    requestAnimationFrame(render);
    tween.update(ts);
    camTween.update(ts);
    deltaT = performance.now() - last;  //frametime, allows features to not be dependant on framerate
    //controls.update();
    renderer.clear();
    renderer.render(sceneClouds, camera);
    renderer.clearDepth();
    renderer.render(scene, camera);
    renderWarp();
    renderClouds();
    analyser.getByteFrequencyData(freqData);
    //update shape
    if (performance.now() - buildTime >= 10)
    {
        rotationZ += 0.001;
        hu+= 0.001 * deltaT;
        //color rainbow 
        if (audioPlaying) 
        {
            dirLight.color.setHSL(hu*0.3, 0.5, 0.5);
            for(var i=0; i<cloudLights.length; i++)
            {       //mid range frequencies, typically singing
                cloudLights[i].color.setHSL( (hu*(i*0.33)) * map(avgData[1], 0, 255, 0.1, 0.4) , 1, 0.5);
            }
        }
        updateColours(geometry, hu, 0.0001);
        buildTime = performance.now();
        //smooth out the data using a complementary filter and average out range of frequencies
        avgData[0] = (avg(freqData, 0, 20) *0.8) + avgData[0] *0.2;
        avgData[1] = (avg(freqData, 20, 50 )*0.8) + avgData[1] *0.2 ;
        avgData[2] = (avg(freqData, 50, 100) *0.8) + avgData[2] *0.2 ;
        avgData[3] = (avg(freqData, 100, 200) *0.8) + avgData[3] *0.2 ;
        avgData[4] = (avg(freqData, 200, 300) *0.8) + avgData[4] *0.2 ;
        avgData[5] = (avg(freqData, 300, 400) *0.8) + avgData[5] *0.2 ;
        //generateShape(disp.F1m, disp.F1n1, disp.F1n2, disp.F1n3, disp.F2m, disp.F2n1,  disp.F2n2, disp.F2n3); //debug
        generateShape(map(avgData[3], 0, 255, -0.5, 70), 
            map(avgData[3], 0, 255, -50, 50), 
            map(avgData[0], 0, 255, -40, 40), 
            map(avgData[1], 0, 255, 40, -40), 
            map(avgData[4], 0, 255, 10, 50), 
            map(avgData[1],  0, 255, 0.1, 15.0),  
            map(avgData[2],  0, 255, -10, 10), 
            map(avgData[5],  0, 255, -0, 50));
        updateGeometry(geometry);
        mesh.rotation.z = rotationZ;    //slowly rotates shape around its z axis
    }

    //after a random period of time, rotate the object to a new position
    if (audioPlaying && Date.now() - lastTweenTime > 0)
    {
        lastTweenTime = Date.now() + (10 + 30*Math.random()) * 1000;
        var randView;
        do{
            randView = Math.round(Math.random()*(views.length-1));
        } while( currentView == randView)
        currentView = randView;
        var targetRot = views[currentView];
        tween = new TWEEN.Tween(mesh.rotation)
        .to( targetRot, 5000)
        .delay(400)
        .easing(TWEEN.Easing.Quadratic.Out);

        if (currentView == 0) {
            //move the camera into the shape
            camTween = new TWEEN.Tween(camera.position)
            .to( camIn, 5000)
            .delay(400)
            .easing(TWEEN.Easing.Quadratic.Out);
        } else{
            //move the camera out of the shape
            camTween = new TWEEN.Tween(camera.position)
            .to( camOut, 5000)
            .delay(400)
            .easing(TWEEN.Easing.Quadratic.Out);
        }
        tween.start();
        camTween.start();
    }

    last = performance.now();
}

function avg(arr, start, end)
{
    if (end < start || arr ==null) return null;
    let sum = 0;
    for (let i=start; i < end; i++)
    {
        sum += arr[i];
    }
    return sum/(end-start);
}

function onMouseMove(event) 
{ 
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
function onClick(event)
{
    audioHTML = document.getElementById("audioFile");
    audioHTML.play();
    ctx.resume();
    audioPlaying = true;
}
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', onClick, true);
