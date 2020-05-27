var tasklang = require("./index");
var task = new tasklang({ apple: 12 });

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

task.run().then(() => {
  let s = task.storage;
  if ((s.apple === 22 && s.orange === 2, s.milk === 5)) return console.log("test all passed");
  console.log("Error", task.storage, "should be", { apple: 22, orange: 2, milk: 5 });
});
