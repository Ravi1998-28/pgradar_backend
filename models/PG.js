const mongoose = require('mongoose');

const pgSchema = new mongoose.Schema({
  name: String,
  city: String,
  address: String,
  price: Number,
  features: [String],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

module.exports = mongoose.model('PG', pgSchema);
