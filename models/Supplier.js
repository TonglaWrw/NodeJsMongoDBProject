const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let supplierSchema = new Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    saleDate: {type: Date, required: true},
    storeLocation: {type: String, required: true},
    items: [{
        name: {type: String, required: true},
        tags: [{type: String, required: true}],
        price: {type: Number, required: true},
        quantity: {type: Number, required: true}, 
    }],
    customer: {
        gender: {type: String, required: true},
        age: {type: Number, required: true},
        email: {type: String, required: true, unique: true},
        satisfaction: {type: Number, required: true}
    },
    couponUsed: {type: Boolean, required: true},
    purchaseMethod: {type: String, required: true}
}, {
    collection: "sample_supplies"
})

const SupplierModel = mongoose.model('Supplier', supplierSchema);

module.exports = SupplierModel;

