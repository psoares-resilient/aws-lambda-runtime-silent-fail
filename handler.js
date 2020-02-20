"use strict";

// This in node should be called when a process is about to exit
// In regular node runtime, this is logged, inside a lambda this is
// completely ignored.
process.on('exit', (args) => console.log({ exit: args }));
process.on('disconnect', (args) => console.log({ disconnect: args }));

module.exports.errorRuntimeNode = async () => {
  console.log("About to open a promise that will never resolve/error");
  // Library opens a never ending promise and process dies completely
  // tricking lambda into returning OK somehow, even though no response was
  // explicitly returned (no ok, no error, no nothing)
  await new Promise((resolve, reject) => {
    console.log("Promise started... ");
  });

  // any line after the never ending promise has been executed just does nothing ie:
  console.log("This does not get logged");

  // This line also never gets executed.
  throw new Error("I wish this would fail the lambda");

  // try catch finally has no effect
};
