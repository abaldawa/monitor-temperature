## Author: Abhijit Baldawa

## monitor-temperature
A full stack application to monitor live temperature of breweries.
##### Front end: React.js (used react context instead of redux to not complicate UI for small usecase. Also used react hooks)
##### Backend: Node.js
##### Database: Inmemory mock JSON based database

## How to run:
1. git clone project
2. npm i
3. npm start -> this will generate dist folder inside "client" and start the node.js server on port 3000 
4. On the browser go to localhost:3000 to see the UI.


### NOTE: Port is configurable by setting PORT value in environment variable or can be configured under {project}/server/src/config/serverConfig.json under httpServer object.


To run the unit tests run:
#### npm run unitTests

## Points to note:
1. The latest ECMA script syntax is used and everything is build on the latest version of Node.js (12.4.0)
2. I have designed coding patterns and although the entire code is completely documented with Jsdocs and comments, below approach is designed by me for usages of async/await.

```javascript
// Problem: Cannot handle precise error
async function test() {
    try{
        let res1 = await asyncOperation1();
        
        if(res1) {
          //...
        }
        
        let res2 = await asyncOperation1();
        
        if(res2) {
          //...
        }
        
        let res3 = await asyncOperation1();
        
        if(res3) {
          //...
        }
        
        
        let res4 = await asyncOperation1();
        
        if(res4) {
          //...
        }
        
    } catch(e) {
        console.log(`I do not know which operation threw an error but for logging and also on UI i want to show user exactly what went wrong`, e);
    }
}

// Solution I have used using ES6 array destructuring. 
// Note: Also got rid of try/catch though it can still be present if required to catch some 
// unexpected error in the user code (not async operation) but not necessary.
async function test() {
    let
        err,
        result1,
        result2,
        result3,
        result4;

    [err, result1] = await formatPromiseResult( asyncOperation1() );
    
    if( err ) {
        // I have a chance to handle this precise error
        console.error(`asyncOperation1 failed because: ${err.stack || err}`);
        throw err; // I can also customise the precise error message if this is a controller method
    }

    [err, result2] = await formatPromiseResult( asyncOperation2() );

    if( err ) {
        // I have a chance to handle this precise error
        console.error(`asyncOperation2 failed because: ${err.stack || err}`);
        throw err;
    }

    [err, result3] = await formatPromiseResult( asyncOperation3() );

    if( err ) {
        // I have a chance to handle this precise error
        console.error(`asyncOperation3 failed because: ${err.stack || err}`);
        throw err;
    }

    [err, result4] = await formatPromiseResult( asyncOperation4() );

    if( err ) {
       // I have a chance to handle this precise error
        console.error(`asyncOperation4 failed because: ${err.stack || err}`);
        throw err;
    }
    
    return "some result";
}

// This is a utility function and can be imported from all the modules
function formatPromiseResult( prom ) {
    return prom
            .then((result) => {
                return [null, result];
            })
            .catch( (err) => {
                return [err];
            } );
}

```
