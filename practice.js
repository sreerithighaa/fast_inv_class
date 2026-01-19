const Person=require('./practice2.js')

const sub=(a,b)=> a-b

const obj1={
    name:"Alice",
    age:25,
    greet:function(){
        return `Hello, my name is ${this.name} and I am ${this.age} years old.`
    }
}

const {name,age,greet}=obj1

console.log(name)
function greetPerson({name,age}){
    return `Hello, my name is ${name} and I am ${age} years old.`

}
console.log(greetPerson(obj1))




function add(a,b,su){
    const subvalue=su(a,b)
    return `Addition ${a+b} Subtraction : ${subvalue}`
}
const result=add(10,5,sub)


console.log(result)

const roles=[
    {name:"daniel"},
    {name:"alice"},
    {name:"bob"}]

    roles.forEach((r)=>{
        console.log(r.name)
    })