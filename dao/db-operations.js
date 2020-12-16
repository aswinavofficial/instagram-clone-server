const mongoose = require('mongoose')
const user = mongoose.model("User")


function fetchNearestUsers(coordinates, maxDistance) {
    return user.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: coordinates
                },
                $maxDistance: maxDistance
            }
        }
    })
    .exec()
    .catch(error => {
        console.log(error);
    });
}

exports.fetchNearestUsers = fetchNearestUsers;