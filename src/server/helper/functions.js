module.exports = {
    idWithLog: (message) => {
        return (x) => {
            console.log(message, x)
            return x
        }
    }
}

module.exports = {
    clean: (obj) => {
        for (const propName in obj) { 
          if (obj[propName] === null || obj[propName] === undefined) {
            delete obj[propName];
          }
        }
      }
      
      
}