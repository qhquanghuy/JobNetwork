const hash = require('hash.js')
module.exports = {
    idWithLog: (message) => {
        return (x) => {
            console.log(message, x)
            return x
        }
    },
    clean: (obj) => {
        for (const propName in obj) { 
          if (obj[propName] === null || obj[propName] === undefined) {
            delete obj[propName];
          }
        }
      },
      sha256: (data) => {
        return Buffer.from(hash.sha256().update(data).digest())
      }

}
