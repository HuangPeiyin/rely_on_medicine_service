var express = require('express');
var router = express.Router();
var drug = require('../models/drug_information')
var sickness = require('../models/sickness')
var book = require('../models/medicine_books')
// var treat = require('../models/treat_methods')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* 添加药品信息接口 */
router.post('/addDrug', (req, res) => {
  let drugMsg = new drug({
    drug_name: req.body.drug_name,
    drug_photo: req.body.drug_photo ? req.body.drug_photo : "暂无",
    drug_type: req.body.drug_type ? req.body.drug_type : "其他",
    drug_effect: req.body.drug_effect,
    drug_dose: req.body.drug_dose
  })
  drugMsg.save((err, addMsg) => {
    if(err){
      res.json({ status: 1, message: "药品信息添加失败", data: err })
    }else{
      res.json({ status: 0, message: "药品信息添加成功", data: addMsg })
    }
  })
})

/* 删除药品信息接口 */
router.post('/deleteDrug', (req, res) => {
  drug.deleteOne({ _id: req.body.drug_id }, (err, deleteMsg) => {
    if (err) {
      res.json({ status: 1, message: "删除失败", data: err })
    } else {
      res.json({ status: 0, message: "删除成功", data: deleteMsg })
    }
  })
})

/* 修改药品信息接口 */
router.post('/updateDrug', (req, res) => {
  drug.findByDrugId(req.body.drug_id, (err, drugMsg) => {
    if(err){
      res.json({ status: 1, message: "信息错误", data: err})
    }
    if(drugMsg.length != 0){
      let drugUpdate = {
        drug_name: req.body.name ? req.body.drug_name : drugMsg[0].drug_name,
        drug_photo: req.body.drug_photo ? req.body.drug_photo : drugMsg[0].drug_photo,
        drug_type: req.body.drug_type ? req.body.drug_type : drugMsg[0].drug_type,
        drug_effect: req.body.drug_effect ? req.body.drug_effect : drugMsg[0].drug_effect,
        drug_dose: req.body.drug_dose ? req.body.drug_dose : drugMsg[0].drug_dose
      }
      drug.update({ _id: req.body.drug_id }, drugUpdate, (err, updateMsg) => {
        if (err) {
          res.json({ status: 1, message: "修改失败", data: err })
        } else {
          res.json({ status: 0, message: "修改成功", data: updateMsg })
        }
      })
    }
  })
  
})

/* 通过药品类型查找接口 */
router.post('/selectDrugType', (req, res) => {
  drug.findByType(req.body.drug_type, (err, drugMsg) => {
    if (err) {
      res.json({ status: 1, message: "药品类型不存在或为其他" }) 
    } else {
      res.json({ status: 0, message: "查找成功", data: drugMsg })
    }
  })
})

/* 查找所有药品信息接口 */
router.get('/selectDrugAll', (req, res) => {
  drug.findAll(( err, drugMsg )=>{
    if(err){
      res.json({ status: 1, message: "数据库无信息", data: err })
    }else{
      res.json({ status: 0, message: "查找成功", data: drugMsg })
    }
  })
})

/* 添加疾病信息接口 */
router.post('/addSickness', (req, res) => {
  let sicknessMsg = new sickness({
    sick_name: req.body.sick_name,
    sick_anotherName: req.body.sick_anotherName ? req.body.sick_anotherName : "无",
    sick_type: req.body.sick_type ? req.body.sick_type : "其他",
    sick_symptom: req.body.sick_symptom,
    sick_department: req.body.sick_department
  })
  sicknessMsg.save((err, addMsg) => {
    if(err){
      res.json({ status: 1, message: "疾病信息添加失败", data: err})
    }else{
      res.json({ status: 0, message: "疾病信息添加成功", data: addMsg})
    }
  })
})

/* 删除疾病信息接口 */
router.post('/deleteSickness', (req, res) => {
  sickness.deleteOne({_id: req.body.sick_id}, (err, deleteMsg) => {
    if(err){
      res.json({ status: 1, message: "删除失败", data: err})
    }else{
      res.json({ status: 0, message: "删除成功", data: deleteMsg})
    }
  })
})

/* 修改疾病信息接口 */
router.post('/updateSickness', (req, res) => {
  sickness.findBySickID(req.body.sick_id, (err, sickMsg) => {
    if(err){
      res.json({ status: 1, message: "信息错误"})
    }
    if(sickMsg.length != 0){
      let sickUpdate = {
        sick_name: req.body.sick_name ? req.body.sick_name : sickMsg[0].sick_name,
        sick_anotherName: req.body.sick_anotherName ? req.body.sick_anotherName : sickMsg[0].sick_anotherName,
        sick_type: req.body.sick_type ? req.body.sick_type : sickMsg[0].sick_type,
        sick_symptom: req.body.sick_symptom ? req.body.sick_symptom : sickMsg[0].sick_symptom,
        sick_department: req.body.sick_department ? req.body.sick_department : sickMsg[0].sick_department
      }
      sickness.update({_id: req.body.sick_id}, sickUpdate, (err, updateMsg) => {
        if(err){
          res.json({ status: 1, message: "修改失败", data: err})
        }else{
          res.json({ status: 0, message: "修改成功", data: updateMsg})
        }
      })
    }
  })
})

/* 查找疾病类型信息接口 */
router.post('/selectSickType', (req, res) => {
  sickness.findBySickType(req.body.sick_type, (err, sickMsg) => {
    if(err){
      res.json({ status: 1, message: "查找失败", data: err})
    }else{
      res.json({ status: 0, message: "查找成功", data: sickMsg})
    }
  })
})

/* 查找疾病科室信息接口 */
router.post('/selectSickDepart', (req, res) => {
  sickness.findBySickDepart(req.body.sick_department, (err, sickMsg) => {
    if(err){
      res.json({ status: 1, message: "查找失败", data: err})
    }else{
      res.json({ status: 0, message: "查找成功", data: sickMsg})
    }
  })
})

/* 查找所有疾病信息接口 */
router.get('/selectSickAll', (req, res) => {
  sickness.findAll((err, sickMsg) => {
    if(err){
      res.json({ status: 1, message: "查找失败", data: err})
    }else{
      res.json({ status: 0, message: "查找成功", data: sickMsg})
    }
  })
})

/* 添加书籍信息接口 */
router.post('/addBook', (req, res) => {
  let bookMsg = new book({
    book_name: req.body.book_name,
    book_author: req.body.book_author,
    book_press: req.body.book_press,
    book_place: req.body.book_place,
    book_ISBN: req.body.book_ISBN,
    book_publicationTime: req.body.book_publicationTime,
    book_picture: req.body.book_picture ? req.body.book_picture : "暂无",
    book_presentation: req.body.book_presentation
  })
  bookMsg.save(( err, addMsg ) => {
    if(err){
      res.json({ status: 1, message: "书籍信息添加失败", data: err})
    }else{
      res.json({ status: 0, message: "书籍信息添加成功", data: addMsg})
    }
  })
})

/* 删除书籍信息接口 */
router.post('/deleteBook', (req, res) => {
  book.deleteOne({_id: req.body.book_id}, (err, deleteMsg) => {
    if(err){
      res.json({ status: 1, message: "删除失败", data: err})
    }else{
      res.json({ status: 0, message: "删除成功", data: deleteMsg})
    }
  })
})

/* 修改书籍信息接口 */
router.post('/updateBook', (req, res) => {
  book.findByBookID(req.body.book_id, (err, bookMsg) => {
    if(err){
      res.json({ status: 1, message: "信息出错", data: err})
    }
    if(bookMsg.length != 0){
      let bookUpdate = {
        book_name: req.body.book_name ? req.body.book_name : bookMsg[0].book_name,
        book_author: req.body.book_author ? req.body.book_author : bookMsg[0].book_author,
        book_press: req.body.book_press ? req.body.book_press : bookMsg[0].book_press,
        book_place: req.body.book_place ? req.body.book_place : bookMsg[0].book_place,
        book_ISBN: req.body.book_ISBN ? req.body.book_ISBN : bookMsg[0].book_ISBN,
        book_publicationTime: req.body.book_publicationTime ? req.body.book_publicationTime : bookMsg[0].book_publicationTime,
        book_picture: req.body.book_picture ? req.body.book_picture : bookMsg[0].book_picture,
        book_presentation: req.body.book_presentation ? req.body.book_presentation : bookMsg[0].book_presentation
      }
      book.update({_id: req.body.book_id}, bookUpdate, (err, updateMsg) => {
        if(err){
          res.json({ status: 1, message: "修改失败", data: err})
        }else{
          res.json({ status: 0, message: "修改成功", data: updateMsg})
        }
      })
    }
  })
})

/* 查找所有书籍信息接口 */
router.get('/selectBookAll', ( req, res ) => {
  book.findAll((err, bookMsg) => {
    if(err){
      res.json({ status: 1, message: "查找失败", data: err})
    }else{
      res.json({ status: 0, message: "查找成功", data: bookMsg})
    }
  })
})

module.exports = router;
