var mongoose = require('../common/mongodb')
var drug = new mongoose.Schema({
    drug_name: String,
    drug_photo: String,
    drug_type: String,
    drug_effect: String,
    drug_dose: String
})
// 查找所有药品
drug.statics.findAll = function (callBack){
    this.find({}, callBack)
}
// 药品ID查找
drug.statics.findByDrugId = function (drug_id, callBack){
    this.find({ _id: drug_id }, callBack)
}
// 药品名称查找
drug.statics.findByDrugName = function (drug_name, callBack){
    this.find({ drug_name: drug_name }, callBack)
}
// 药品类型查找
drug.statics.findByType = function (type, callBack){
    this.find({ drug_type: type }, callBack)
}

var drugModel = mongoose.model('drug', drug)
module.exports = drugModel