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
  await dc.open();
  throw new Error("I wish this would fail the lambda");
};
