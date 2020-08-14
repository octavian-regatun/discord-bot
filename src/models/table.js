const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var tableSchema = new mongoose.Schema({
  array: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
});

//Export the model
module.exports = mongoose.model('Table', tableSchema);
