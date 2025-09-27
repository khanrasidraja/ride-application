// if([]){
//     console.log("true");
// }
// else{
//     console.log("false");
// }

// let obj ={
//     a:{
//         b : undefined
//     }}

//     console.log(obj?.a?.b?.c?.d??"not found");

var abc = 25;
if(function f(){}){
    abc = abc + typeof f; 
}
console.log(abc);