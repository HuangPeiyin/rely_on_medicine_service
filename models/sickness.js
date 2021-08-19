var mongoose = require('../common/mongodb')
var sickness = new mongoose.Schema({
    sick_name: String,
    sick_anotherName: String,
    sick_type: String,
    sick_symptom: String,
    sick_department: String
})
sickness.statics.findBySickID = function (id, callBack){
    this.find({ _id: id }, callBack)
}
sickness.statics.findBySickName = function ( name, callBack ){
    this.find({ sick_name: name }, callBack)
}
sickness.statics.findBySickType = function ( type, callBack ){
    this.find({ sick_type: type }, callBack)
}
sickness.statics.findBySickDepart = function ( department, callBack ){
    this.find({ sick_department: department }, callBack)
}
sickness.statics.findAll = function (callBack){
    this.find({}, callBack)
}

var sicknessModel = mongoose.model('sickness', sickness)
module.exports = sicknessModel