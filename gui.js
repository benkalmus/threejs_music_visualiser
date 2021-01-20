//allows modifying the shape using the control panel. Debug only

var DisplayGUI = function () {
    this.autoPlay = false;
    this.a = Math.PI/2;
    this.b = Math.PI;
    this.F1m = -7.2;
    this.F1n1 = 3;
    this.F1n2 = -3;
    this.F1n3 = 5.6;
    this.F2m = 20;
    this.F2n1 = 1;
    this.F2n2 = 1;
    this.F2n3 = 1;
};

var colourPicker =  {color: "#1861b3" };
var gui = new dat.GUI();
var disp = new DisplayGUI();
var autoPlayBool = gui.add(disp, "autoPlay", false, true);
var sliderA = gui.add(disp, 'a', -40, 40);
var sliderB = gui.add(disp, 'b', -40, 40);
var F1M = gui.add(disp, 'F1m', -40, 40);
var F1n1 = gui.add(disp, 'F1n1', -40, 40);
var F1n2 = gui.add(disp, 'F1n2', -40, 40);
var F1n3 = gui.add(disp, 'F1n3', -40, 40);
var F2M = gui.add(disp, 'F2m', -40, 40);
var F2n1 = gui.add(disp, 'F2n1', -40, 40);
var F2n2 = gui.add(disp, 'F2n2', -40, 40);
var F2n3 = gui.add(disp, 'F2n3', -40, 40);

gui.close();