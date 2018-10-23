module.exports = {
    idWithLog: (message) => {
        return (x) => {
            console.log(message, x)
            return x
        }
    }
}