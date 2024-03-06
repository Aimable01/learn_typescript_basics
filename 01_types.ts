//---------special types
let demo: any = true;
let demo1: unknown = "unknown type";
let demo2: undefined = undefined;
// let demo3: never = true;   // This one always returns an error
let demo4: null = null;

//-----------------normal types
let fname: string = "Aimable";
let age: number = 23;
let isStudent: boolean = true;

// arrays
let names: string[] = [];
names.push("name1");
let staticArray: readonly String[] = ["nameStatic"]; //reads only

let people: (string | number)[] = ["John", 23, "Jane", "45"]; // stores both strings and numbers

// tuples
let myTuple: [number, boolean, string];
myTuple = [12, false, "aimable"];
console.log("hello world");

//objects
let person: { name: string; age: number } = { name: "jonhn", age: 45 };

let employee: object;
employee = {
  name: "aimable",
  age: 38,
  residence: "Musanze",
};
console.log(employee);

//union types
function add(a: number | string, b: number | string) {
  if (typeof a == "number" && typeof b == "number") return a + b;
  if (typeof a == "string" && typeof b == "string") return a.concat(b);
  throw new Error("Should be a string or a number");
}

console.log(add("b", "a"));

//Aliases
type alphanumeric = string | number;
let alpha: alphanumeric = "hello";
let numeric: alphanumeric = 45;

//String literals
let mousemvt: "click" | "dbclick" | "mouseover";
mousemvt = "click";

//if else
