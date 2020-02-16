const express = require('express')
const boom = require('boom')
const Result = require('../module/result')
const userRouter = require('./user')
const jwtAuth = require('./jwt')

// const {
//   CODE_ERROR
// } = require('../utils/constant')

const router = express.Router()
// 对所有路由进行 jwt 认证
router.use(jwtAuth)

router.use('/user', userRouter)

router.use((req, res, next) => {
  next(boom.notFound('接口不存在'))
})
/**
 * 自定义的异常处理中间件
 * 1. 方法的参数不能减少
 * 2. 方法必须放在路由最后
 */
router.use((err, req, res, next) => {
  console.log(err)
  if (err.name === 'UnauthorizedError') {
    new Result(null, 'token失效', {
      error: err.status,
      errorMsg: err.name
    }).expired(res.status(err.status))
  } else {
    const msg = (err && err.message) || '系统错误'
    const statusCode = (err.output && err.output.statusCode) || 500
    const errorMsg = (err.output && err.output.payload && err.output.payload.error) || err.message
    new Result(null, msg, {
      error: statusCode,
      errorMsg
    }).fail(res.status(statusCode))
  }
})

module.exports = router
