const route = require('express').Router()
const CommandCenter = require('../controller/CommandCenter')

route.get('/inventory', CommandCenter.inventory)
route.get('/encyclopedia', CommandCenter.encyclopedia)
route.get('/encyclopedia/SSR', CommandCenter.SSR)
route.get('/encyclopedia/SR', CommandCenter.SR)
route.get('/encyclopedia/R', CommandCenter.R)
route.get('/encyclopedia/UC', CommandCenter.UC)
route.get('/encyclopedia/C', CommandCenter.C)
route.get('/gamble', CommandCenter.gamble)
route.get('/rolls', CommandCenter.rolls)
route.get('/roll1', CommandCenter.roll1)
route.get('/roll10', CommandCenter.roll10)
route.get('/promisedPathing', CommandCenter.promisedPathing)
route.get('/promisedRoll', CommandCenter.promisedRoll)
route.get('/freeDiamond', CommandCenter.freeDiamond)


module.exports = route