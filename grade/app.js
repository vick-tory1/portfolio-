function getGrade(){
  let yourScore = document.getElementById("score").value;

  if(yourScore >= 75 && yourScore <= 100){
    //alert("A+");
    document.getElementById("yourGrade").innerHTML = "A+";
    document.getElementById("yourGrade").style = "color: #aaaaff";
  }

  else if(yourScore >= 65 && yourScore <= 74){
    //alert("A");
    document.getElementById("yourGrade").innerHTML = "A";
    document.getElementById("yourGrade").style = "color: #009688";
  }

  else if(yourScore >= 55 && yourScore <= 64){
    //alert("B");
    document.getElementById("yourGrade").innerHTML = "B";
    document.getElementById("yourGrade").style = "color: #4Caf50";
  }
  
  else if(yourScore >= 50 && yourScore <= 54){
    //alert("C");
    document.getElementById("yourGrade").innerHTML = "C";
    document.getElementById("yourGrade").style = "color: #8bc34a";
  }

else if(yourScore >= 45 && yourScore <= 49){
    //alert("D");
    document.getElementById("yourGrade").innerHTML = "D";
    document.getElementById("yourGrade").style = "color: #ffd800";
  }

else if(yourScore >= 40 && yourScore <= 44){
    //alert("E");
    document.getElementById("yourGrade").innerHTML = "E";
    document.getElementById("yourGrade").style = "color: #cf5247ff";
  }

else if(yourScore <= 39 && yourScore >= 0){
    //alert("F9");
    document.getElementById("yourGrade").innerHTML = "F9";
    document.getElementById("yourGrade").style = "color: #ff0000";
  }

else{
    document.getElementById("yourGrade").innerHTML = "Invalid input";
  }
}