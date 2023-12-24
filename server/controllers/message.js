const Message = require("../models/Message");

const OPENED_ROOMS = ["react", "node"];

exports.getOldMessages = (req, res, next) => {
    const { roomName } = req.params;
    if(OPENED_ROOMS.includes(roomName)) {
        Message.find({ room: roomName }).then((message) => {
            console.log(message);
            return res.status(200).json(message);            
        }).catch((err) => {
            console.log(err);
        });
    } else {
        return res.status(403).json("Room is not opened.");
    }
}