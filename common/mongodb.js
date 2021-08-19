var mongoose = require('mongoose')
var url = 'mongodb://localhost:27017/rely_on_medicine'
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useCreateIndex', true)
mongoose.connection.on('error', function (error) {
    console.log("数据库连接失败：" + error);
})
mongoose.connection.on('open', function () {
    console.log("-------数据库连接成功！-------");
})
module.exports = mongoose