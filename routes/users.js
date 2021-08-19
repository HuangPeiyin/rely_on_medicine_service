var express = require('express');
var router = express.Router();
var crypto = require('crypto')
var consumer = require('../models/consumer')
var health = require('../models/personal_health')

const init_token = 'TKL02o'

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* 用户登录接口 */
router.post('/login', (req, res) => {
  if (!req.body.u_phone) {
    res.json({ status: 1, message: "账号为空" })
  }
  if (!req.body.u_password) {
    res.json({ status: 1, message: "密码为空" })
  }
  consumer.findConsumerLogin(req.body.u_phone, req.body.u_password, function (err, consumerSave) {
    if (consumerSave.length != 0) {
      var token_after = getMD5Password(consumerSave[0]._id)
      res.json({ status: 0, message: "登录成功", data: { token: token_after, consumer: consumerSave }, message: "用户登录成功" })
    } else {
      res.json({ status: 1, message: "账号或者密码错误" })
    }
  })
})

/* 用户注册接口 */
router.post('/register', (req, res) => {
  if (!req.body.u_name) {
    res.json({ status: 1, message: "用户名为空" })
  }
  if (!req.body.u_password) {
    res.json({ status: 1, message: "密码为空" })
  }
  if (!req.body.u_phone) {
    res.json({ status: 1, message: "手机账号为空" })
  }
  consumer.findByConsumerName(req.body.u_name, function (err, consumerSave) {
    if (consumerSave.length != 0) {
      res.json({ status: 1, message: "该用户名已被注册" })
    } else {
      var registerConsumer = new consumer({
        u_name: req.body.u_name,
        u_password: req.body.u_password,
        u_sex: req.body.u_sex ? req.body.u_sex : "未知",
        u_age: req.body.u_age ? req.body.u_age : 0,
        u_avatar: req.body.u_avatar ? req.body.u_avatar : "无",
        u_birth: req.body.u_birth ? req.body.u_birth : 0,
        u_phone: req.body.u_phone,
        u_email: req.body.u_email ? req.body.u_birth : "用户未设置",
        u_admin: 0,
        u_power: 0,
        u_stop: 0
      })
      registerConsumer.save(function (err, addConsumer) {
        if(err){
          res.json({ status: 1, message: "注册失败"})
        }
        res.json({ status: 0, message: "注册成功", data: addConsumer })
      })
    }
  })
})

/* 用户找回密码接口 */
router.post('/findPassword', (req, res) => {
  // 输入更改后的密码
  if (req.body.repassword) {
    // 用户已登录进去主界面，进行修改密码
    if (req.body.token) {
      if (!req.body.u_password) {
        res.json({ status: 1, message: "用户老密码错误" })
      }
      if (req.body.token == getMD5Password(req.body.u_id)) {
        consumer.findByConsumerID(req.body.u_id, function (err, checkUser) {
          if (checkUser) {
            consumer.update({ _id: req.body.u_id }, { u_password: req.body.repassword }, function (err, updateMsg) {
              if (err) {
                res.json({ status: 1, message: "更改错误", data: err })
              }
              res.json({ status: 0, message: "更改成功", data: updateMsg })
            })
          } else {
            res.json({ status: 1, message: "用户信息错误" })
          }
        })
      }
    } else { // 用户未登录，忘记密码时进行更改密码
      consumer.findConsumerVerify(req.body.u_name, req.body.u_phone, function (err, consumerMsg) {
        if (consumerMsg.length != 0) {
          consumer.update({ _id: consumerMsg[0]._id }, { u_password: req.body.repassword }, function (err, updateCon) {
            if (err) {
              res.json({ status: 1, message: "更改失败" })
            }
            res.json({ status: 0, message: "更改成功" })
          })
        } else {
          res.json({ status: 1, message: "信息错误" })
        }
      })
    }
  } else {   // 用户未登录，忘记密码时的用户验证信息
    if (!req.body.u_name) {
      res.json({ status: 1, message: "用户名为空" })
    }
    if (!req.body.u_phone) {
      res.json({ status: 1, message: "手机账号为空" })
    }
    consumer.findConsumerVerify(req.body.u_name, req.body.u_phone, function (err, consumerMsg) {
      if (consumerMsg.length != 0) {
        res.json({ status: 0, message: "验证成功，请修改密码", data: consumerMsg })
      } else {
        res.json({ status: 1, message: "填写信息错误" })
      }
    })
  }
})

/* 用户修改个人信息接口 */
router.post('/updateConsumer', (req, res) => {
  if (req.body.token == getMD5Password(req.body.u_id)) {
    consumer.findByConsumerID( req.body.u_id, function (err, consumerMsg) {
      if(err){
        res.json({ status: 1, message: "用户信息错误" })
      }
      if (consumerMsg.length != 0) {
        let Msg = {
          u_name: req.body.u_name ? req.body.u_name : consumerMsg[0].u_name,
          u_password: req.body.u_password ? req.body.u_password : consumerMsg[0].u_password,
          u_sex: req.body.u_sex ? req.body.u_sex : consumerMsg[0].u_sex,
          u_age: req.body.u_age ? req.body.u_age : consumerMsg[0].u_age,
          u_avatar: req.body.u_avatar ? req.body.u_avatar : consumerMsg[0].u_avatar,
          u_birth: req.body.u_birth ? req.body.u_birth : consumerMsg[0].u_birth,
          u_phone: req.body.u_phone ? req.body.u_phone : consumerMsg[0].u_phone,
          u_email: req.body.u_email ? req.body.u_email : consumerMsg[0].u_email
        }
        consumer.update({ _id: req.body.u_id }, Msg, function (err, updateMsg) {
          if (err) {
            res.json({ status: 1, message: "修改失败", data: err })
          } else {
            res.json({ status: 0, message: "修改成功", data: updateMsg })
          }
        })
      } else {
        res.json({ status: 1, message: "用户信息错误" })
      }
    })
  }else{
    res.json({ status: 1, message: "用户验证错误"})
  }
})

/* 查看用户个人所有信息 */
router.post('/consumerMsg', (req, res) => {
  consumer.findByConsumerID(req.body.u_id, function(err, msg){
    if(err){
      res.json({ status: 1, message: "用户信息获取失败", data: err})
    }else{
      res.json({ status: 0, message: "用户信息获取成功", data: msg})
    }
  })
})

/* 查看所有用户 */
router.get('/consumers', (req, res) => {
  consumer.findAll(function (err, msg) { 
    if(err){
      res.json({ status: 1, message: "获取失败", data: err})
    }else{
      res.json({ status: 0, message: "获取成功", data: msg})
    }
  })
})

/* 用户添加健康信息 */
router.post('/addHealth', (req, res) => {
  if(!req.body.identity){
    res.json({ status: 1, message: "身份为空"})
  }
  consumer.findByConsumerID(req.body.u_id, function(err, msg){
    if(err){
      res.json({ status: 1, message: "无该用户信息"})
    }
    if(msg.length != 0){
      var healthMsg = new health({
        u_id: req.body.u_id,
        h_weight: req.body.h_weight ? req.body.h_weight : 0,
        h_height: req.body.h_height ? req.body.h_height : 0,
        h_temperature: req.body.h_temperature ? req.body.h_temperature : 0,
        h_blood_pressure: req.body.h_blood_pressure ? req.body.h_blood_pressure : 0,
        h_blood_glucose: req.body.h_blood_glucose ? req.body.h_blood_glucose : 0,
        h_blood_fat: req.body.h_blood_fat ? req.body.h_blood_fat : 0,
        h_heart_rate: req.body.h_heart_rate ? req.body.h_heart_rate : 0,
        h_sleep: req.body.h_sleep ? req.body.h_sleep : 0,
        identity: req.body.identity
      })
      healthMsg.save(function (err, addMsg){
        if(err){
          res.json({ status: 1, message: "添加失败"})
        }
        res.json({ status: 0, message: "添加成功", data: addMsg})
      })
    }
  })
})

/* 用户删除健康信息 */
router.post('/deleteHealth', (req, res) => {
  if(!req.body.identity){
    res.json({ status: 1, message: "身份为空"})
  }
  health.findByIDAndIdentity(req.body.u_id, req.body.identity, function (err, healthMsg){
    if(healthMsg.length != 0){
      health.deleteOne({u_id: req.body.u_id, identity: req.body.identity}, function(err, deleteMsg){
        if(err){
          res.json({ status: 1, message: "删除失败", data: err})
        }else{
          res.json({ status: 0, message: "删除成功", data: deleteMsg})
        }
      })
    }else{
      res.json({ status: 1, data: err})
    }
  })
})

/* 用户修改健康信息 */
router.post('/updateHealth', (req, res) => {
  if(!req.body.identity){
    res.json({ status: 1, message: "身份为空"})
  }
  health.findByIDAndIdentity(req.body.u_id, req.body.identity, function(err, healthMsg){
    if(healthMsg.length != 0){
      var healthMsg = {
        h_weight: req.body.h_weight ? req.body.h_weight : healthMsg[0].h_weight,
        h_height: req.body.h_height ? req.body.h_height : healthMsg[0].h_height,
        h_temperature: req.body.h_temperature ? req.body.h_temperature : healthMsg[0].h_temperature,
        h_blood_pressure: req.body.h_blood_pressure ? req.body.h_blood_pressure : healthMsg[0].h_blood_pressure,
        h_blood_glucose: req.body.h_blood_glucose ? req.body.h_blood_glucose : healthMsg[0].h_blood_glucose,
        h_blood_fat: req.body.h_blood_fat ? req.body.h_blood_fat : healthMsg[0].h_blood_fat,
        h_heart_rate: req.body.h_heart_rate ? req.body.h_heart_rate : healthMsg[0].h_heart_rate,
        h_sleep: req.body.h_sleep ? req.body.h_sleep : healthMsg[0].h_sleep
      }
      health.update({u_id: req.body.u_id, identity: req.body.identity}, healthMsg, function (err, updateMsg){
        if(err){
          res.json({ status: 1, message: "修改失败", data: err})
        }else{
          res.json({ status: 0, message: "修改成功", data: updateMsg})
        }
      })
    }else{
      res.json({ status: 1, message: "查找失败", data: err})
    }
  })
})

/* 用户查找健康信息 */
router.post('/selectOneHealth', (req, res) => {
  if(!req.body.identity){
    res.json({ status: 1, message: "身份为空"})
  }
  health.findByIDAndIdentity(req.body.u_id, req.body.identity, function (err, healthMsg){
    if(err){
      res.json({ status: 1, message: "查找失败", data: err})
    }else{
      res.json({ status: 0, message: "查找成功", data: healthMsg})
    }
  })
})

/* 用户查找个人所有的健康信息 */
router.post('/selectAllHealth', (req, res) => {
  health.findByUserID(req.body.u_id, function (err, healthMsg){
    if(err){
      res.json({ status: 1, message: "查找失败", data: err})
    }else{
      res.json({ status: 0, message: "查找成功", data: healthMsg})
    }
  })
})

// 获取MD5值
function getMD5Password(id) {
  var md5 = crypto.createHash('md5')
  var token_before = id + init_token
  // res.json(userSave[0]._id)
  return md5.update(token_before).digest('hex')
}

module.exports = router;
