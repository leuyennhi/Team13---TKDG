var onClickModel = () =>{
    var x = document.getElementById("height").value;
    var y = document.getElementById("waist").value;
    console.log(y)
    if (y>80){
        $("#model").attr("src","/images/Models/3.png");
        console.log(3)
    }
    else if (x>170){
        $("#model").attr("src","/images/Models/1.png");
        console.log(1)
    }else{
        $("#model").attr("src","/images/Models/2.png");
        console.log(2)
    }
}