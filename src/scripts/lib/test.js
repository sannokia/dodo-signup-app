// @flow

//Maybe types - where a value type is optional - ?number (Common to cross check with '!= null' or use typeof)
//Optional object properties - obj: { foo?: string }
//Optional function parameters - c?: Boolean
//Function parameters with defaults - b: number = 1,
//Literal Types - 'Using literal values as types' - d: 5
//Single types - n: number

function concat(
  a: number,
  b: number = 1,
  c?: Boolean,
  d: 5,
  obj: { foo?: string }
): ?number {
  console.log(obj, d);
  return c ? a + b : 0;
}

//Mixed types
// (1) A group of different possible types - value: string | number
// (2) A type based on another type - value: T (Similiar to Generics in .Net!)
// (3) An arbitrary type that could be anything - value: mixed
function stringifyBasicValue(value: string | number) {
  return '' + value;
}

function identity<T>(value: T): T {
  return value;
}

function getTypeOf(value: mixed): string {
  return typeof value;
}

//Opting out of the type checker - use the 'any' type - two: any
function add(one: any, two: any): number {
  return one + two;
}

export { stringifyBasicValue, identity, getTypeOf, add };

export default concat;
