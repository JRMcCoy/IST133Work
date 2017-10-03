//Var
var on = true;
var onButtonActiveColor = "#ff0000";
var offButtonActiveColor = "#00ff00";
var onButtonDisabledColor = "#000000";
var offButtonDisabledColor = "#ffffff";



function toggleButton(element){

  var onButton =  document.getElementById("onButton");
  var offButton =  document.getElementById("offButton");
  var body = document.body;

  if(on){
    onButton.style.backgroundColor = onButtonDisabledColor;
    offButton.style.backgroundColor = offButtonActiveColor;
    onButton.style.color = "black";
    offButton.style.color = "black";
    body.style.backgroundColor = "#000000";
    on = false;
  }else{
    onButton.style.backgroundColor = onButtonActiveColor;
    offButton.style.backgroundColor = offButtonDisabledColor;
    onButton.style.color = "black";
    offButton.style.color = "white";
    body.style.backgroundColor = "#ffffff";
    on = true;
  }/*
  if(on){
    alert("Lights on!")
  }else{
    alert("Lights off!");
  }*/
}
