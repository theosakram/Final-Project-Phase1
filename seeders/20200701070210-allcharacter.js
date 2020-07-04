'use strict';
const fs = require('fs')

module.exports = {
  up: (queryInterface, Sequelize) => {
    let dataSSR = JSON.parse(fs.readFileSync('./data/SSR.json', 'utf-8'))

    for (let i = 0; i < dataSSR.length; i++) {
      dataSSR[i].createdAt = new Date()
      dataSSR[i].updatedAt = new Date()
    }

    let dataSR = JSON.parse(fs.readFileSync('./data/SR.json', 'utf-8'))

    for (let i = 0; i < dataSR.length; i++) {
      dataSR[i].createdAt = new Date()
      dataSR[i].updatedAt = new Date()
    }

    let dataR = JSON.parse(fs.readFileSync('./data/R.json', 'utf-8'))

    for (let i = 0; i < dataR.length; i++) {
      dataR[i].createdAt = new Date()
      dataR[i].updatedAt = new Date()
    }

    let dataUC = JSON.parse(fs.readFileSync('./data/UC.json', 'utf-8'))

    for (let i = 0; i < dataUC.length; i++) {
      dataUC[i].createdAt = new Date()
      dataUC[i].updatedAt = new Date()
    }

    let dataC = JSON.parse(fs.readFileSync('./data/C.json', 'utf-8'))

    for (let i = 0; i < dataC.length; i++) {
      dataC[i].createdAt = new Date()
      dataC[i].updatedAt = new Date()
    }

    return queryInterface.bulkInsert('AllCharacters', [...dataSSR, ...dataSR, ...dataR, ...dataUC, ...dataC], {})

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('AllCharacters', null, {})
  }
};
