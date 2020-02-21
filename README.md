# Problem

AWS Lambdas running node will exit with a code of Success when the runTime exits without finishing properly (giving an ok result or throwing an error).

In node land, calling `process.exit(0)` tells node to exit and that statusCode is of success.

Also in node land, listening to the `exit` event can trigger a callback like so:

```
process.on('exit', (args) => console.log("log:", { exit: args }));
```

Running the above code would likely give a: `log: {exit: 0}` for when things exit gracefuly. When finishing on an exception, the exit code is non-zero.


We know Node "returns" when it finds a never ending promise (a promise that will never reject/resolve, has no timer associated with it...) Node will just stop dead, but the event `exit` is emitted.

The important different, is that Lambda somehow hijacks runTime -- the internals are a black box, but I assume it is needed for orchestration, management, the clever suspending to keep them hot, etc. The problem is that the callback on exit is then never called. A fundamental lifecycle event gets blanked.

This means that in the eventual scenario the never ending Promise occurs, Lambda will stop that node execution (nothing after that promise will be called) and return as if it was successful.

This is super dangerous as services that depend on lambda return codes alone: i.e: Out of the box SQS => LAMBDA subscriptions will give false positives and messaged that should have been retried or DLQed will be dropped.