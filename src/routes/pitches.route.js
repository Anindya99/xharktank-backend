const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Pitch=require('../models/pitches.model');
const Offer=require('../models/offers.model');

/**
 * @route   GET pitches
 * @desc    get all pitch
 * @access  Public
 */
 router.get(
    '/', 
   async (req, res) => {
    try {   
        const pitches = await Pitch.find().sort({time:-1});

        const offers= await Offer.find().sort({ time: -1 });
      
        var newPitches= pitches.map(pitch=>{
              //filtering the offers of respective pitch  
              var off2= offers.filter(obj => obj.pitchId.equals(pitch._id)).map(obj=>{
                const obj2={id:obj._id,investor:obj.investor,amount:obj.amount,equity:obj.equity,comment:obj.comment};
                return obj2;
              });

              const newPitch={id:pitch._id,entrepreneur:pitch.entrepreneur,pitchTitle:pitch.pitchTitle,pitchIdea:pitch.pitchIdea,
                askAmount:pitch.askAmount,equity:pitch.equity,offers:off2};
              return newPitch;   
        });
        
        res.status(201).json(newPitches);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

);

/**
 * @route   POST pitch
 * @desc    post a pitch
 * @access  Public
 */
 router.post(
    '/', 
   async (req, res) => {
    
   const newPitch = new Pitch({
    entrepreneur: req.body.entrepreneur,
    pitchTitle: req.body.pitchTitle,
    pitchIdea: req.body.pitchIdea,
    askAmount: req.body.askAmount,
    equity: req.body.equity
  });
   
  try{
    if (Object.keys(req.body).length===0) {
      throw Error('Send proper data');
   }
   if (Object.keys(req.body).length>5) {
    throw Error('Invalid data'); 
   }
   if(newPitch.entrepreneur==null ||newPitch.pitchTitle==null ||newPitch.pitchIdea==null ||newPitch.askAmount==null ||newPitch.equity==null
     || newPitch.entrepreneur.trim().length===0 || newPitch.pitchTitle.trim().length===0|| newPitch.pitchIdea.trim().length===0 
     || newPitch.askAmount<0 || newPitch.equity<0 || newPitch.equity>100){
      throw Error('Invalid data.');
    }
    const pitch = await newPitch.save();
    res.status(201).json({id:pitch._id});
  }catch (e) {
    res.status(400).json({ msg: e.message });
  }
 }

 );

/**
 * @route   GET a pitch 
 * @desc    get a pitch by id
 * @access  Public
 */
 router.get(
    '/:id', 
   async (req, res) => {
    try {   
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {throw Error('Not Found');}
        const pitch = await Pitch.findById(req.params.id);
        if (!pitch) throw Error('Not Found');
        
        const alloffers= await Offer.find().sort({ time: -1 });
        var offers= alloffers.filter(obj => obj.pitchId.equals(req.params.id) );
        var off2= offers.map(obj=>{
          const obj2={id:obj._id,investor:obj.investor,amount:obj.amount,equity:obj.equity,comment:obj.comment};
          return obj2;
        });
        
        const newPitch={id:pitch._id,entrepreneur:pitch.entrepreneur,pitchTitle:pitch.pitchTitle,pitchIdea:pitch.pitchIdea,
          askAmount:pitch.askAmount,equity:pitch.equity,offers:off2};
        res.status(201).json(newPitch);
    } catch (e) {
      if(e.message==='Not Found') res.status(404).json({ msg: e.message });
      else res.status(400).json({ msg: e.message });
    }
}

);

/**
 * @route   POST offer
 * @desc    post a offer
 * @access  Public
 */
 router.post(
  '/:id/makeOffer', 
 async (req, res) => {

  
 
 const newOffer = new Offer({
  pitchId: req.params.id,   
  investor: req.body.investor,
  amount: req.body.amount,
  equity: req.body.equity,
  comment: req.body.comment
});

try{

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {throw Error('Not Found');}

  if (Object.keys(req.body).length===0) {
    throw Error('Send proper data');
 }
 if (Object.keys(req.body).length>4) {
  throw Error('Invalid data'); 
 }
 if(newOffer.investor==null ||newOffer.amount==null ||newOffer.equity==null ||newOffer.comment==null
   || newOffer.investor.trim().length===0 || newOffer.comment.trim().length===0
   || newOffer.amount<0 || newOffer.equity<0 || newOffer.equity>100){
    throw Error('Invalid data');
  }

  const pitch = await Pitch.find({_id : req.params.id});
  if (!pitch) throw Error('Not Found');
  

  const offer = await newOffer.save();
  res.status(201).json({id:offer._id});
}catch (e) {
  if(e.message==='Not Found') res.status(404).json({ msg: e.message });
  else res.status(400).json({ msg: e.message });
}
}

);


 module.exports=router;
