interface Person {
  name: string;
  age: number;
  greet: () => void;
}

const alice: Person = {
  name: "Alice",
  age: 74,
  greet: () => console.log(`Hi, Iam ${alice.name}`),
};

alice.greet();
