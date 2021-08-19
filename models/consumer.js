var mongoose = require('../common/mongodb')
var consumer = new mongoose.Schema({
    u_name: String,
    u_password: String,
    u_sex: String,
    u_age: Number,
    u_avatar: String,
    u_birth: Date,
    u_phone: String,
    u_email: String,
    u_admin: Boolean,
    u_power: Number,
    u_stop: Boolean
})
// 用户ID查找
consumer.statics.findByConsumerID = function (u_id, callBack){
    this.find({ _id: u_id }, callBack)
}
// 用户名查找
consumer.statics.findByConsumerName = function (name, callBack) {
    this.find({ u_name: name }, callBack)
}
// 登录用户信息
consumer.statics.findConsumerLogin = function (phone, password, callBack) {
    this.find({ u_phone: phone, u_password: password, u_stop: false }, callBack)
}
// 用户验证
consumer.statics.findConsumerVerify = function (name, phone, callBack){
    this.find({ u_name: name, u_phone: phone }, callBack)
}

consumer.statics.findAll = function (callBack){
    this.find({}, callBack)
}

var consumerModel = mongoose.model('consumer', consumer)
module.exports = consumerModel