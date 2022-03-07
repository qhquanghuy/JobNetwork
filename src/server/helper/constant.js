
const userRole = {
    user: 1,
    employer: 2,
    issuer: 3
};
const requestedCertStatus = {
    pending: 1,
    rejected: 2,
    approved: 3
};
const appliedJobStatus = {
    pending: 1,
    rejected: 2,
    approved: 3
};
const secret = "alksdfjlaksdfj";
const es256Private = '-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIMwyiEZ2KKERN0iRdMYkEXci8RWeAodGPSe7z0SEDNZRoAoGCCqGSM49\nAwEHoUQDQgAE8bKVkrOz8QMbqnXDx2Qc+xDMV+FDJInQbULfn82gh3B+Q8SOrhJD\nUZqRMQgCFtDqv21Njyun1o9ijEzfsq/6XQ==\n-----END EC PRIVATE KEY-----'
const es256Public = '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE8bKVkrOz8QMbqnXDx2Qc+xDMV+FD\nJInQbULfn82gh3B+Q8SOrhJDUZqRMQgCFtDqv21Njyun1o9ijEzfsq/6XQ==\n-----END PUBLIC KEY-----'
const ethAddress = '0x9AB922c78D959Bb2d5252265c35D9fE31B8d8c7e'
const ethBaseGasLimit = 21000
const ethGasPricePerByte = 68
const ropstenId = 3
const ropstenInfuraApi = "https://ropsten.infura.io/b42c54ee5023450ca91df647b55060a5"
const burnAddress = "0x000000000000000000000000000000000000dEaD"
module.exports = {
    userRole: userRole,
    requestedCertStatus: requestedCertStatus,
    appliedJobStatus: appliedJobStatus,
    secret: secret,
    es256Private: es256Private,
    es256Public: es256Public,
    ethAddress: ethAddress,
    ropstenId: ropstenId,
    ethBaseGasLimit: ethBaseGasLimit,
    ethGasPricePerByte: ethGasPricePerByte,
    ropstenInfuraApi: ropstenInfuraApi,
    burnAddress: burnAddress

}