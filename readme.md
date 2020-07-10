# Tasklanguage 2

super elegant implementation of `tasklanguage`

### example:

```js
var tasklang = require("tl2");
var task = new tasklang({ apple: 12 }, console.log);

task.add("add 3", (store, next) => {
  store.apple += 3;
  return next("rest");
});

task.add("add 5", (store, next) => {
  store.apple += 5;
  return next();
});

task.add("rest", task._NOOP);

task.add(
  "add 7",
  (store, next, orange, milk = 1) => {
    store.apple += 7;
    store.orange = orange;
    store.milk = milk;
    return next();
  },
  2,
  5
);

task.run().then(() => console.log(task.storage));
//output: { apple: 22, orange: 2, milk: 5 }
```

## API

#### constructor(initialStorage = {}, logMethod?)

`logMethod` should be a self-defined function and will pass in

`(param:{index:number,name:string,func:()=>{},param:[]})=>{}`

#### add(name, func, ...param?)

`func` takes in (store, next, ...param)

and inside `func` call `next(name?)` to jump to next one

#### async run(name?)

`task.storage` won't reset after each run.

#### async runAuto(name?)

auto jump to next command after each function call, doesn't need to manually call next()

#### \_NOOP

do nothing, call `next()`
