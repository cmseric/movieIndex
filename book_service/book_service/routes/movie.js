var express = require('express');
var router = express.Router();
var movie = require('../models/movie');
var comment = require('../models/comment');

// 显示所有电影列表
router.get('/list', function (req, res, next) {
  movie.findAll(function (err, getMovies) {
    res.json({status: 0, message: '获取电影列表', data: getMovies})
  })
})
// 根据id查找电影详情
router.post('/detail', function (req, res, next) {
  if (!req.body.movie_id) {
    res.json({status: 1, message: '电影id传递失败'})
  }
  movie.findById(req.body.movie_id, function (err, getMovie) {
    res.json({status: 0, message: '获取电影详情', data: getMovie})
  })
})
// 下载电影
router.post('/download', function (req, res, next) {
  if (!req.body.id) {
    res.json({status: 1, message: '电影id传递失败'})
  } else {
    movie.findById(req.body.id, function (err, supportMovie) {
      movie.update({_id: req.body.id}, {movieNumDownload: supportMovie.movieNumDownload + 1}, function (err) {
        if (err) {
          res.json({status: 1, message: '下载失败', data: err})
        }
        res.json({status: 0, message: '下载成功', data: supportMovie.movieDownload})
      })
    })
  }
})
// 获取相关电影的点赞和下载数
router.post('/showNumber', function (req, res, next) {
  if (req.body.id) {
    movie.findById(req.body.id, function (err, getMovie) {
      res.json({status: 0, message: '获取成功', data: {movieNumDownload: getMovie.movieNumDownload, movieNumSuppose: getMovie.movieNumSuppose}})
    })
  } else {
    res.json({status: 1, message: '获取失败'})
  }
})
// 给电影点赞
router.post('/support', function (req, res, next) {
  if (req.body.id) {
    movie.findById(req.body.id, function (err, getMovie) {
      // res.json({test: getMovie.movieNumSuppose + 1})
      movie.update({_id: req.body.id}, {movieNumSuppose: getMovie.movieNumSuppose + 1}, function (err, movieUpdate) {
        if (err) {
          res.json({status: 1, message: '点赞错误', data: err})
        }
        res.json({status: 0, message: '点赞成功', data: movieUpdate})
      })
    })
  } else {
    res.json({status: 1, message: '获取失败'})
  }
})
// 获取电影评论
router.post('/comment', function (req, res, next) {
  if (req.body.id) {
    comment.findByMovieId(req.body.id, function (err, allComment) {
      res.json({status: 0, message: '获取成功', data: allComment})
    })
  } else {
    res.json({status: 1, message: '获取失败'})
  }
})

module.exports = router