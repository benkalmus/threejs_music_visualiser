
/* Supershapes */
var total = 128;
var globe = [];
globe = new Array(total+1);
for (var i = 0; i < total+1; i++) {    //create 2d array
    globe[i] = []; 
} 

var a = Math.PI/2;
var b =  Math.PI;
var r = 50;
const maxRadius = 150;
function superShape(theta, m, n1, n2 , n3 )
{    
    let t1 = Math.abs((1/a)* Math.cos (m * theta / 4));
    t1 = Math.pow(t1, n2);
    let t2 = Math.abs((1/b) * Math.sin (m * theta / 4));
    t2 = Math.pow(t2, n3);
    let t3 = t1 + t2;
    return Math.pow(t3, -1/n1);
}
function map(n, start1, stop1, start2, stop2)
{
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}

var params = [10];

for(let i=0; i<10; i++)
{
    params[i] = 1;
}
//code for generating coordinates of the supershape given parameters.
function generateShape(m1=10.8, f1n1=5, f1n2=-2, f1n3=-2, m2=20, f2n1=1.1, f2n2=1.1, f2n3=1 )
{
    for (var i = 0; i < total+1; i++)
    {
        let lat = map(i, 0, total, -HALF_PI, HALF_PI);
        let r2 = superShape(lat, m1, f1n1, f1n2, f1n3);
        for (var j = 0; j < total+1; j++)
        {
            let lon = map(j, 0, total, -PI, PI);
            let r1 = superShape(lon, m2, f2n1, f2n2 , f2n3 );
            //to cartesian coords
            let x = r *r1* Math.cos(lon) * r2 *  Math.cos(lat);
            let y = r *r1* Math.sin(lon) * r2* Math.cos(lat);
            let z = r * r2 * Math.sin(lat);

            globe[i][j] = new THREE.Vector3(x, y, z);
        }
    }
}

function renderGeometry(geometry)
{
    for (let i = 0; i < globe.length-1; i++) 
    {
        for (let j = 0; j < globe[i].length -1; j++) {
            var index = geometry.vertices.length;
            var findex = geometry.faces.length;
            geometry.vertices.push(new THREE.Vector3(globe[i][j].x, globe[i][j].y, globe[i][j].z))
            geometry.vertices.push(new THREE.Vector3(globe[i+1][j].x, globe[i+1][j].y, globe[i+1][j].z))
            geometry.vertices.push(new THREE.Vector3(globe[i][j+1].x, globe[i][j+1].y, globe[i][j+1].z))
            geometry.vertices.push(new THREE.Vector3(globe[i+1][j+1].x, globe[i+1][j+1].y, globe[i+1][j+1].z))
            geometry.colors[index] = new THREE.Color(1, 1, 1);
            geometry.colors[index+1] = new THREE.Color(1, 1, 1);
            geometry.colors[index+2] = new THREE.Color(1, 1, 1);
            geometry.colors[index+3] = new THREE.Color(1, 1, 1);
        }
    }
}
function updateGeometry(geometry)
{
    var index=0, findex=0;
    for (let i = 0; i < globe.length-1; i++) 
    {
        for (let j = 0; j < globe[i].length -1; j++) {
            geometry.vertices[index].set(globe[i][j].x, globe[i][j].y, globe[i][j].z);
            geometry.vertices[index+1].set(globe[i+1][j].x, globe[i+1][j].y, globe[i+1][j].z);
            geometry.vertices[index+2].set(globe[i][j+1].x, globe[i][j+1].y, globe[i][j+1].z);
            geometry.vertices[index+3].set(globe[i+1][j+1].x, globe[i+1][j+1].y, globe[i+1][j+1].z);
            index+=4;
            findex+=2;
        }
    }  
    geometry.verticesNeedUpdate = true;
}

function updateColours(geometry, hue, density)
{
    for(let i =0; i < geometry.colors.length; i++)
    {
        geometry.colors[i].setHSL(hue + ( i * density), 1, 0.4); 
    }
    geometry.colorsNeedUpdate = true;
}