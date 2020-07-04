const { AllCharacter, User, Inventory } = require('../models')
const { compare } = require('../helpers/bcrypt')
const { Sequelize } = require('sequelize')

class CommandCenter {
  static home(req, res) {
    res.render('index')
  }

  static loginForm(req, res) {
    const err = req.session.err
    delete req.session.err
    res.render('loginForm', { err })
  }

  static login(req, res) {
    const { nickname, password } = req.body

    User.findOne({
      where: {
        nickname
      }
    }).then(data => {
      if (data) {
        if (compare(password, data.password)) {
          req.session.loginStatus = true
          req.session.data = [data.nickname, data.diamond, data.id]
          res.redirect('/menu')
        } else {
          req.session.err = ('Wrong password')
          res.redirect('/login')
        }
      } else {
        req.session.loginStatus = false
        req.session.err = ('User not found or wrong password')
        res.redirect('/login')
      }
    }).catch(err => {
      req.session.err = err.message
      res.redirect('/login')
    })
  }

  static addCharaForm(req, res) {
    res.render('addCharaForm')
  }

  static addChara(req, res) {
    let newChara = {
      name: req.body.name,
      grade: req.body.grade
    }

    AllCharacter.create(newChara)
      .then(chara => {
        res.redirect('/user/encyclopedia')
      }).catch(err => res.send(err))
  }

  static editCharaForm(req, res) {
    let param = +req.params.id
    AllCharacter.findByPk(param)
      .then(chara => {
        res.render('editCharaForm', { chara })
      }).catch(err => res.send(err))
  }

  static editChara(req, res) {
    let param = +req.params.id
    let editedChara = {
      name: req.body.name,
      grade: req.body.grade
    }
    AllCharacter.update(editedChara, {
      where: {
        id: param
      }
    })
      .then(chara => {
        res.redirect('/user/encyclopedia')
      }).catch(err => res.send(err))
  }

  static menu(req, res) {
    const nickname = req.session.data[0]
    User.findOne({
      where: {
        nickname: nickname
      }
    }).then(data => {
      res.render('main-menu', { nickname, data })
    })
  }

  static inventory(req, res) {
    let param = req.session.data[2]
    User.findByPk(param, {
      include: [
        {
          model: Inventory, include: AllCharacter
        }
      ]
    }).then(data => {
      res.render('inventory', { data })
    }).catch(err => res.send(err.message))
  }

  static registerForm(req, res) {
    const err = req.session.err
    delete req.session.err
    res.render('registerForm', { err })
  }

  static register(req, res) {
    const { nickname, email, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      req.session.err = 'You put two different passwords'
      res.redirect('/register')
    } else {
      const newUser = {
        nickname,
        email,
        password,
        diamond: 0,
        role: 'user'
      }

      User.create(newUser)
        .then(data => res.redirect('/login'))
        .catch(err => {
          req.session.err = err.message
          res.redirect('/register')
        })
    }
  }

  static encyclopedia(req, res) {
    res.render('encyclopedia')
  }

  static gamble(req, res) {
    res.render('gamble')
  }

  static rolls(req, res) {
    const err = req.session.err
    let param = req.session.data[2]

    User.findOne({
      where: {
        id: param
      }
    }).then(data => res.render('rolls', { data, err }))
      .catch(err => res.send(err.message))
  }

  static roll1(req, res) {
    let value = Math.ceil(Math.random() * 100)
    let param = req.session.data[2]
    let valueGrade;

    if (value > 99.75) {
      valueGrade = 'SSR'
    } else if (value > 97.5) {
      valueGrade = 'SR'
    } else if (value > 90) {
      valueGrade = 'R'
    } else if (value > 75) {
      valueGrade = 'UC'
    } else valueGrade = 'C'

    let newData = null, newData2 = null

    if (req.session.data[1] >= 30) {
      User.findOne({
        where: {
          id: param
        }
      }).then(data => {
        newData = data
        return AllCharacter.findOne({
          where: {
            grade: valueGrade
          }, order: [
            Sequelize.fn('RANDOM')
          ]
        })
      }).then(data2 => {
        newData2 = data2
        let newInventory = {
          user_id: param,
          chara_id: data2.id
        }
        return Inventory.create(newInventory)
      }).then(data => {
        let updateUser = {
          diamond: newData.diamond - 30
        }

        return User.update(updateUser, {
          where: {
            id: param
          }
        })
      }).then(result => {
        res.render('rollsLandingPage', { newData, newData2 })
      })
        .catch(err => res.send(err))
    } else {
      req.session.err = 'Not enough diamond'
      res.redirect('/rolls')
    }
  }

  static roll10(req, res) {
    let param = req.session.data[2]
    let valueArr = Array.from({ length: 10 }, (x, y) => Math.ceil(Math.random() * 100))
    let arrFix = valueArr.map(x => x > 99.75 ? x = 'SSR' : x > 97.5 ? x = 'SR' : x > 90 ? x = 'R' : x > 75 ? x = 'UC' : x = 'C')

    let newData = null, newData2 = null
    if (req.session.data[1] >= 270) {
      User.findOne({
        where: {
          id: param
        }
      }).then(data => {
        newData = data
        return AllCharacter.findAll()
      }).then(data2 => {
        let charaSSR = data2.filter(x => x.grade === 'SSR')
        let charaSR = data2.filter(x => x.grade === 'SR')
        let charaR = data2.filter(x => x.grade === 'R')
        let charaUC = data2.filter(x => x.grade === 'UC')
        let charaC = data2.filter(x => x.grade === 'C')

        let arrFix2 = []

        for (let i = 0; i < arrFix.length; i++) {
          if (arrFix[i] === 'SSR') {
            arrFix2.push(charaSSR[Math.floor(Math.random() * charaSSR.length)])
          } else if (arrFix[i] === 'SR') {
            arrFix2.push(charaSR[Math.floor(Math.random() * charaSR.length)])
          } else if (arrFix[i] === 'R') {
            arrFix2.push(charaR[Math.floor(Math.random() * charaR.length)])
          } else if (arrFix[i] === 'UC') {
            arrFix2.push(charaUC[Math.floor(Math.random() * charaUC.length)])
          } else arrFix2.push(charaC[Math.floor(Math.random() * charaC.length)])
        }

        let newInventory = []

        for (let i = 0; i < 10; i++) {
          newInventory[i] = {
            user_id: param,
            chara_id: arrFix2[i].id
          }
        }

        newData2 = arrFix2
        return Inventory.bulkCreate(newInventory)
      }).then(data3 => {
        let updateUser = {
          diamond: newData.diamond - 270
        }
        return User.update(updateUser, {
          where: {
            id: param
          }
        })
      }).then(data4 => {
        res.render('rollsLandingPage10', { newData, newData2 })
      }).catch(err => res.send(err))
    } else {
      req.session.err = 'Not enough diamond'
      res.redirect('/rolls')
    }
  }


  static promisedRollPage(req, res) {
    let param = req.session.data[2]
    let { name } = req.query
    req.session.name = name
    let newData = null
    User.findByPk(param)
      .then(data => {
        newData = data
        return AllCharacter.findOne({
          where: {
            name: name
          }
        })
      }).then(data2 => res.render('name', { newData, data2 }))
      .catch(err => res.send(err.message))
  }

  static promisedPathing(req, res) {
    req.session.count = 20
    let count = req.session.count
    AllCharacter.findAll({
      where: {
        grade: 'SSR'
      }
    }).then(data => res.render('promisedPathing', { data, count }))
      .catch(err => res.send(err.message))
  }

  static promisedRoll(req, res) {
    let param = req.session.data[2]
    let charaName = req.session.name
    let valueArr = Array.from({ length: 10 }, (x, y) => Math.ceil(Math.random() * 100))
    let arrFix = valueArr.map(x => x > 99.75 ? x = 'SSR' : x > 97.5 ? x = 'SR' : x > 90 ? x = 'R' : x > 75 ? x = 'UC' : x = 'C')

    let newData = null, newData2 = null
    if (req.session.data[1] >= 300) {
      User.findOne({
        where: {
          id: param
        }
      }).then(data => {
        newData = data
        return AllCharacter.findAll()
      }).then(data2 => {
        let charaSSR = data2.filter(x => x.grade === 'SSR')
        let charaSR = data2.filter(x => x.grade === 'SR')
        let charaR = data2.filter(x => x.grade === 'R')
        let charaUC = data2.filter(x => x.grade === 'UC')
        let charaC = data2.filter(x => x.grade === 'C')

        let countStatus = charaSSR.filter(x => x.name === charaName)

        let arrFix2 = []

        for (let i = 0; i < arrFix.length; i++) {
          if (arrFix[i] === 'SSR') {
            arrFix2.push(charaSSR[Math.floor(Math.random() * charaSSR.length)])
          } else if (arrFix[i] === 'SR') {
            arrFix2.push(charaSR[Math.floor(Math.random() * charaSR.length)])
          } else if (arrFix[i] === 'R') {
            arrFix2.push(charaR[Math.floor(Math.random() * charaR.length)])
          } else if (arrFix[i] === 'UC') {
            arrFix2.push(charaUC[Math.floor(Math.random() * charaUC.length)])
          } else arrFix2.push(charaC[Math.floor(Math.random() * charaC.length)])
        }

        let newInventory = []

        let countObj = {
          user_id: param,
          chara_id: countStatus[0].id
        }

        for (let i = 0; i < 10; i++) {
          newInventory[i] = {
            user_id: param,
            chara_id: arrFix2[i].id
          }
        }

        if (countStatus[0].count === 0) {
          arrFix2.push(countStatus[0])
          newInventory.push(countObj)
        }

        newData2 = arrFix2
        return Inventory.bulkCreate(newInventory)
      }).then(data3 => {
        let updateUser = {
          diamond: newData.diamond - 300
        }
        return User.update(updateUser, {
          where: {
            id: param
          }
        })
      }).then(data4 => {
        return AllCharacter.findOne({
          where: {
            name: charaName
          }
        })
      }).then(data5 => {

        console.log(data5.count)

        let updateCount = {
          count: null
        }

        if (data5.count === 0) {
          updateCount.count = 10
        } else updateCount.count = data5.count - 1

        return AllCharacter.update(updateCount, {
          where: {
            name: charaName
          }
        })
      }).then(data6 => {
        res.render('promisedRollLandingPage', { newData, newData2 })
      }).catch(err => res.send(err.message))
    } else {
      req.session.err = 'Not enough diamond'
      res.redirect('/rolls')
    }
  }

  static SSR(req, res) {
    AllCharacter.findAll({
      where: {
        grade: 'SSR'
      }
    }).then(ssr => {
      res.render('SSRs', { ssr })
    }).catch(e => res.send(e))
  }

  static SR(req, res) {
    AllCharacter.findAll({
      where: {
        grade: 'SR'
      }
    }).then(sr => {
      res.render('SRs', { sr })
    }).catch(e => res.send(e))
  }

  static R(req, res) {
    AllCharacter.findAll({
      where: {
        grade: 'R'
      }
    }).then(r => {
      res.render('Rs', { r })
    }).catch(e => res.send(e))
  }

  static UC(req, res) {
    AllCharacter.findAll({
      where: {
        grade: 'UC'
      }
    }).then(uc => {
      res.render('UCs', { uc })
    }).catch(e => res.send(e))
  }

  static C(req, res) {
    AllCharacter.findAll({
      where: {
        grade: 'C'
      }
    }).then(c => {
      res.render('Cs', { c })
    }).catch(e => res.send(e))
  }

  static freeDiamond(req, res) {
    let param = req.session.data[2]

    User.findByPk(param)
      .then(data => {
        let addDiamond = {
          diamond: data.diamond + 5000
        }
        return User.update(addDiamond, {
          where: {
            id: param
          }
        })
      }).then(data => res.redirect('/menu'))
      .catch(err => res.send(err.message))
  }

  static delete(req, res) {
    let param = +req.params.id
    AllCharacter.destroy({
      where: {
        id: param
      }
    }).then(data => res.redirect('/user/encyclopedia'))
      .catch(err => res.send(err))
  }
  static logout(req, res) {
    delete req.session.loginStatus
    res.redirect('/login')
  }
}

module.exports = CommandCenter