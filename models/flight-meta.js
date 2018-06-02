const mongoose = require('mongoose')

const schema = mongoose.Schema({
    data:{},
    created_at: {
        type:Date,
        value:Date.now()
    },
    updated_at: Date
})

const flightMeta = mongoose.model('flightMeta', schema)

module.exports = {
    flightMeta
}