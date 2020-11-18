// module.exports = {
//     MONGOURL:  "mongodb://localhost:27017/insta",
//     JWT_SECRET: process.env.JWT_SECRET || "63lEGB97V1"
// }

module.exports = {
    MONGOURL: process.env.MONGOURL || "mongodb://localhost:27017/insta",
    JWT_SECRET: process.env.JWT_SECRET || "63lEGB97V1"
}
