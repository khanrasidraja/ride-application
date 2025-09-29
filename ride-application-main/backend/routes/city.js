const express = require("express");
const cityRoutes = express.Router()
const cityModel = require('../models/city')


//  API to register city data in database.
cityRoutes.post("/cityadd", async (req, res) => {
  try {
    // const citydata = new cityModel(req.body);

      citydata = new cityModel({
        country_id: req.body.country_id,
        city: req.body.city,
        coordinates: req.body.coordinates
      });

    await citydata.save();
    console.log(citydata);

    res.status(201).send({success: true, citydata, message: "City Added Successfully"});

  } catch (error) {
    console.log(error);

    if(error.keyPattern){
      if (error.keyPattern.city) {
        console.log("Country Already Exists")
            return res.status(500).json({success: false, message: "City Already Exists"});
      } 
    }
    res.status(500).json({ success: false, message: error});
  }
});

// --------------------------------GET CITY DATA WITH PAGINATION-----------------------------------//
cityRoutes.get("/citydata", async (req, res) => {
  let page = Math.max(1, parseInt(req.query.page) || 1);   // ensures page is at least 1
  let limit = Math.max(1, parseInt(req.query.limit) || 5); // ensures limit is at least 1
  let skip = (page - 1) * limit;

  try {
    const count = await cityModel.countDocuments();
    const totalPage = Math.ceil(count / limit);

    const aggregatePipeline = [
      {
        $lookup: {
          from: "countrymodels",
          localField: "country_id",
          foreignField: "_id",
          as: "countryDetails",
        },
      },
      { $unwind: "$countryDetails" },
      { $skip: skip },
      { $limit: limit },
    ];

    const citydata = await cityModel.aggregate(aggregatePipeline);

    res.json({
      success: true,
      message: "City Data Found",
      citydata,
      page,
      limit,
      totalPage,
      count,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});




// Duplicate route removed - handled by the route above with pagination



  //  API to update data of city in database using Angular form.
  cityRoutes.put('/cityupdate/:id', async (req, res) => {
      try {
        const cityId = req.params.id;
        const updatedCity = {
          city: req.body.city,
          coordinates: req.body.coordinates
        };
        console.log(updatedCity.city)
        console.log(updatedCity)
  
        let cityData =  await cityModel.findByIdAndUpdate(cityId, updatedCity, {new:true});
       
      res.json({ success: true, message: "City Updated Successfully" ,cityData});
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "City Already Exists" });
    }
  });

  //----------------------------API TO FETCH ALL ZONES OF A COUNTRY-------------------------------//
  cityRoutes.get("/coordinates/:countryid", async (req, res) => {
    try {
      const id = req.params.countryid;
      console.log(id)
      const citydata = await cityModel.find({country_id : id})
      // console.log(citydata)
      res.send(citydata);
    } catch (err) {
      res.status(400).send(err.message.split(":")[2]);
    }
  });



module.exports = cityRoutes;

