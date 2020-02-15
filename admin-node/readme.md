# express注意事项

- 中间件一般放到请求前面
- 异常处理放到请求后面，包含四个参数error,req,res,next