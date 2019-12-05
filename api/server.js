const express = require('express')
const postRouter = require('../blogPost/blogPost-router.js')

const server = express()

server.use('/api/posts', postRouter)

module.exports = server