let mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router();

const e = require('express');
let supplierSchema = require('../models/Supplier')


// API DOCUMENT //
// https://documenter.getpostman.com/view/19507063/UzXXNCv4


router.route('/create').post((req,res,next) => {
    // supplierSchema.init()
    if(!req.body){
        res.status(400).send({message: "Content can not be empthy"});
        return;
    }
    const supplier = req.body;
    var saleDate = new Date()
    saleDate.toLocaleDateString();
    req.body.saleDate = saleDate
    
    // console.log(supplier);
    supplierSchema.create(supplier, (error, data) => {
        if (error) {
            return next(error);
        }else {
            console.log(data);
            res.json(data);
        }
    })
})
// saleDate: {"$gte":new Date("2014-08-18T00:00:00Z"),"$lt":new Date("2014-08-19T00:00:00Z") }
router.route('/test1').get( async (req, res, next) => {
    var start = new Date(req.body.date);
    var end = new Date(start);
    end.setDate(start.getDate()+1);
    end.toLocaleDateString();
    // const end = new Date(dateSet.setDate(dateSet.getDate() + 1));
    const tags = req.body.tags
    // console.log(start);
    // console.log(end);
    // console.log(tags);
    await supplierSchema.aggregate(
        [
            { 
                $unwind: "$items" 
            },
            { 
                $unwind: "$items.tags" 
            },
            {
                $match:
                {
                    saleDate: {"$gte":start,"$lt":end },
                    "items.tags": { '$regex' : tags, '$options' : 'i' }
                }
            },
            {
                $project:
                {
                    storeLocation: 1,
                    items: 1
                }
            },
            { 
                $group:
                {
                _id: { 
                    storeLocation:"$storeLocation", 
                    itemsName:"$items.name",
                    itemsPrice:"$items.price",
                    itemsQuantity:"$items.quantity",
                    TotalPrice:
                        {
                            $sum: { $multiply: [ "$items.price", "$items.quantity" ] }
                        },
                    },
                }
            },
            { 
                $sort: 
                { 
                    "_id.storeLocation" : 1
                } 
            }
            
        ]
    ,(error, data) => {
        if(error) {
            return next(error);
        }else{
            res.json(data);
        }
    })
})

router.route('/test2').get( async(req, res, next) => {
    var email = req.body.email;
    await supplierSchema.aggregate([
        {
            $match: { 
                "customer.email": email
            }
        },
        { 
            $unwind: "$items" 
        },
        { 
            $group:
            {
            _id: { 
                saleDate:"$saleDate", 
                itemsName:"$items.name",
                itemsPrice:"$items.price",
                itemsQuantity:"$items.quantity",
                TotalPrice:
                    {
                        $sum: { $multiply: [ "$items.price", "$items.quantity" ] }
                    },
                },
            
            
            }
        },
    ]
    ,(error, data) => {
        if(error) {
            return next(error);
        }else{
            res.json(data);
        }
    })
})

router.route('/test3').get( async (req, res, next) => {
    let startmonth = new Date(req.body.date);
    var lastmonth= new Date(startmonth.getFullYear(), startmonth.getMonth()+1, 1);

    // console.log(startmonth)
    // console.log(lastmonth)
    
    await supplierSchema.aggregate(
        [
            { 
                $unwind: "$items" 
            },
            { 
                $unwind: "$items.tags" 
            },
            {
                $match:
                {
                    saleDate: {"$gte":startmonth,"$lt":lastmonth },
                }
            },
            // {
            //     $project:
            //     {
            //         storeLocation: 1,
            //     }
            // },
            { 
                $group:
                {
                _id: { 
                    storeLocation:"$storeLocation",
                    saleDate:"$saleDate", 
                    TotalPrice:
                        {
                            $sum: { $multiply: [ "$items.price", "$items.quantity" ] }
                        },
                    },
                }
            },
            { 
                $sort: 
                { 
                    "_id.TotalPrice" : -1
                } 
            },
            {
                $limit: 10
            }
            
        ]
    ,(error, data) => {
        if(error) {
            return next(error);
        }else{
            res.json(data);
        }
    })
})

router.route('/').get((req, res) => {
    supplierSchema.find((error, data) => {
        if(error) {
            return next(error);
        }else{
            res.json(data);
        }
    })
})

// router.route('/edit/:id').get((req,res) => {
//     supplierSchema.findById(req.params.id, (error, data) =>{
//         if(error){
//             return next(error);
//         }else{
//             res.json(data);
//         }
//     })
// })

router.route('/update/:id').put((req, res, next) =>{
    // console.log(req.body)
    supplierSchema.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if( error ){
            return next(error)
            console.log(error)
        }else{
            res.json(data);
            console.log('Updated successfully');
        }
    })
})

router.route('/delete/:id').delete((req, res, next) => {
    supplierSchema.findByIdAndRemove(req.params.id, (error, data) => {
        if(error){
            return next(error);
        }else{
            res.status(200).json({
                msg: data
            })
        }
    })
})

module.exports = router;

