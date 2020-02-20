"use strict";

const gremlin = require("gremlin");

module.exports.errorNull = async () => {
  console.log("Starting process (try catch)");

  const dc = new gremlin.driver.DriverRemoteConnection(
    `wss://127.0.0.1:8281/gremlin`,
    { ssl: true, connectOnStartup: false }
  );

  console.log("About to open a connection that will fail");

  try {
    await dc.open();
  } catch (error) {
    console.log("This log will never happen... Why?", { error });
  } finally {
    throw new Error("I wish this would fail the lambda");
  }
};

module.exports.errorMoreInfo = async () => {
  console.log("Starting process (no try catch)");
  const dc = new gremlin.driver.DriverRemoteConnection(
    `wss://127.0.0.1:8281/gremlin`,
    { ssl: true, connectOnStartup: false }
  );
  console.log("About to open a connection that will fail");
  // Library opens a never ending promise and process dies completely
  // tricking lambda into returning OK somehow, even though no response was
  // explicitly returned (no ok, no error, no nothing)
  await dc.open();

  // This line never gets executed.
  throw new Error("I wish this would fail the lambda");
};

// This in node should be called when a process is about to exit
// In regular node runtime, this is logged, inside a lambda this is
// completely ignored.
process.on('exit', (args) => console.log({ exit: args }));
process.on('disconnect', (args) => console.log({ disconnect: args }));