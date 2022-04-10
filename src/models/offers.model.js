const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const OffersSchema = new Schema({
  pitchId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  investor: {
    type: String,
    required: true
  },
  amount:{
    type:Number,
    min:0,
    required:true
  },
  equity:{
      type: Number,
      min:0,
      max:100,
      required:true
  },
  comment:{
    type:String,
    required:true
  },
  time:{
    type: Date,
    default: Date.now
  }

});

const Offers = mongoose.model('offers', OffersSchema);

module.exports= Offers;