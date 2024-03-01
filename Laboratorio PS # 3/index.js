import { initServer } from './configs/app.js'
import { connect } from './configs/mongo.js'
import { categoriaDefault } from './src/category/category.controller.js'

initServer()
connect()
categoriaDefault()