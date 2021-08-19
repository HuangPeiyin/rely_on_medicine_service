var mongoose = require('../common/mongodb')
var health = new mongoose.Schema({
    u_id: String,
    h_weight: Number,
    h_height: Number,
    h_temperature: Number,
    h_blood_pressure: Number,
    h_blood_glucose: Number,
    h_blood_fat: Number,
    h_heart_rate: Number,
    h_sleep: Number,
    identity: String
})
// 健康用户ID查找
health.statics.findByUserID = function( u_id, callBack ){
    this.find({ u_id: u_id }, callBack)
}
// 健康信息的用户ID和身份查找
health.statics.findByIDAndIdentity = function ( id, identity, callBack){
    this.find({ u_id: id, identity: identity }, callBack)
}

var healthModel = mongoose.model('health', health)
module.exports = healthModel