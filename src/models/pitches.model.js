const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PitchesSchema = new Schema({
  entrepreneur:{
    type: String,
    required: true
  },
  pitchTitle:{
    type: String,
    required: true
  },
  pitchIdea:{
    type: String,
    required: true
  },
  askAmount:{
    type: Number,
    min:0,
    required: true
  },
  equity:{
    type: Number,
    min:0,
    max:100,
    required: true
  },
  time:{
    type: Date,
    default: Date.now
  }
});

const Pitches = mongoose.model('pitches', PitchesSchema);//pitches would be the name of the collection in database

module.exports= Pitches;