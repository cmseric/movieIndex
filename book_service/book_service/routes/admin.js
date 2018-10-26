var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var user = require('../models/user');
var movie = require('../models/movie');
var comment = require('../models/comment');
var article = require('../models/article');
var recommend = require('../models/recommend');
const init_token = 'TKL02o'

// 管理员添加电影
router.post('/movieAdd', function (req, res, next) {

  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'})
  }
  if (!req.body.token) {
    res.json({status: 1, message: '登陆出错'})
  }
  if (!req.body.id) {
    res.json({status: 1, message: '用户传递错误'})
  }
  if (!req.body.movieName) {
    res.json({status: 1, message: '电影名称为空'})
  }
  if (!req.body.movieImg) {
    res.json({status: 1, message: '电影图片为空'})
  }
  if (!req.body.movieDownload) {
    res.json({status: 1, message: '电影下载地址为空'})
  }

  if (!req.body.movieMainPage) {
    var movieMainPage = false
  }
  var check = checkAdminPower(req.body.username, req.body.token, req.body.id)
  if (check.error == 0) {
    user.findByUsername(req.body.username, function (err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        var saveMovie = new movie({
          movieName: req.body.movieName,
          movieImg: req.body.movieImg,
          movieVideo: req.body.movieVideo,
          movieDownload: req.body.movieDownload,
          movieTime: Date.now(),
          movieNumSuppose: 0,
          movieNumDownload: 0,
          movieMainPage: movieMainPage
        })
        saveMovie.save(function (err) {
          if (err) {
            res.json({status: 1, message: err})
          } else {
            res.json({status: 0, message: '添加成功'})
          }
        })
      } else {
        res.json({error: 1, message: '用户没有获得权限或者已经停用'})
      }
    })
  } else {
    res.json({status: 1, message: check.message})
  }
})
// 管理员删除电影
router.post('/movieDel', function (req, res, next) {

  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'})
  }
  if (!req.body.token) {
    res.json({status: 1, message: '登陆出错'})
  }
  if (!req.body.id) {
    res.json({status: 1, message: '用户传递错误'})
  }
  if (!req.body.movieId) {
    res.json({status: 1, message: '电影id传递失败'})
  }

  var check = checkAdminPower(req.body.username, req.body.token, req.body.id)
  if (check.error == 0) {
    user.findByUsername(req.body.username, function (err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        movie.remove({_id: req.body.movieId}, function (err, delMovie) {
          res.json({status: 0, message: '删除成功', data: delMovie})
        })
      } else {
        res.json({status: 1, message: '用户没有获得权限或者已经停用'})
      }
    })
  } else {
    res.json({status: 1, message: check.message})
  }
})
// 管理员更新电影
router.post('/movieUpdate', function (req, res, next) {

  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'})
  }
  if (!req.body.token) {
    res.json({status: 1, message: '登陆出错'})
  }
  if (!req.body.id) {
    res.json({status: 1, message: '用户传递错误'})
  }
  if (!req.body.movieId) {
    res.json({status: 1, message: '电影id传递失败'})
  }

  var saveData = req.body.movieInfo
  var check = checkAdminPower(req.body.username, req.body.token, req.body.id)
  if (check.error == 0) {
    user.findByUsername(req.body.username, function (err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        movie.update({_id: req.body.movieId}, saveData, function (err, updateMove) {
          res.json({status: 0, message: '更新成功', data: updateMove})
        })
      } else {
        res.json({error: 1, message: '用户没有获得权限或者已经停用'})
      }
    })
  } else {
    res.json({status: 1, message: check.message})
  }
})
// 获取用户评论
router.get('/commentsList', function (req, res, next) {
  comment.findAll(function (err, allComment) {
    res.json({status: 0, message: '获取成功', data: allComment})
  })
})
// 审核用户评论
router.post('/checkComment', function (req, res, next) {
  if (!req.body.commentId) {
    res.json({status: 1, message: '评论id传递失败'})
  }
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'})
  }
  if (!req.body.token) {
    res.json({status: 1, message: '登陆出错'})
  }
  if (!req.body.id) {
    res.json({status: 1, message: '用户传递错误'})
  }
  var check = checkAdminPower(req.body.username, req.body.token, req.body.id)
  if (check.error == 0) {
    user.findByUsername(req.body.username, function (err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        comment.update({_id: req.body.commentId}, {check: true}, function (err, updateComment) {
          res.json({status: 0, message: '审核成功', data: updateComment})
        })
      } else {
        res.json({status: 1, message: '用户没有获得权限或者已经停用'})
      }
    })
  } else {
    res.json({status: 1, message: check.message})
  }
})
// 删除用户评论
router.post('/delComment', function (req, res, next) {
  if (!req.body.commentId) {
    res.json({status: 1, message: '评论id传递失败'})
  }
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'})
  }
  if (!req.body.token) {
    res.json({status: 1, message: '登陆出错'})
  }
  if (!req.body.id) {
    res.json({status: 1, message: '用户传递错误'})
  }
  var check = checkAdminPower(req.body.username, req.body.token, req.body.id)
  if (check.error == 0) {
    user.findByUsername(req.body.username, function (err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        comment.remove({_id: req.body.commentId}, function (err, delComment) {
          res.json({status: 0, message: '删除成功', data: delComment})
        })
      } else {
        res.json({status: 1, message: '用户没有获得权限或者已经停用'})
      }
    })
  } else {
    res.json({status: 1, message: check.message})
  }
})
// 封停用户
router.post('/stopUser', function (req, res, next) {
  if (!req.body.userid) {
    res.json({status: 1, message: '用户id传递失败'})
  }
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'})
  }
  if (!req.body.token) {
    res.json({status: 1, message: '登陆出错'})
  }
  if (!req.body.id) {
    res.json({status: 1, message: '用户传递错误'})
  }
  var check = checkAdminPower(req.body.username, req.body.token, req.body.id)
  if (check.error == 0) {
    user.findByUsername(req.body.username, function (err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        user.update({_id: req.body.userid}, {userStop: true}, function (err, updateUser) {
          res.json({status: 0, message: '封停成功', data: updateUser})
        })
      } else {
        res.json({status: 1, message: '用户没有获得权限或者已经停用'})
      }
    })
  } else {
    res.json({status: 1, message: check.message})
  }
})
// 更新用户密码
router.post('/changeUser', function (req, res, next) {
  if (!req.body.userid) {
    res.json({status: 1, message: '用户id传递失败'})
  }
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'})
  }
  if (!req.body.token) {
    res.json({status: 1, message: '登陆出错'})
  }
  if (!req.body.id) {
    res.json({status: 1, message: '用户传递错误'})
  }
  if (!req.body.newPassword) {
    res.json({status: 1, message: '用户新密码错误'})
  }
  var check = checkAdminPower(req.body.username, req.body.token, req.body.id)
  if (check.error == 0) {
    user.findByUsername(req.body.username, function (err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        user.update({_id: req.body.userid}, {password: req.body.newPassword}, function (err, updateUser) {
          res.json({status: 0, message: '更新密码成功', data: updateUser})
        })
      } else {
        res.json({status: 1, message: '用户没有获得权限或者已经停用'})
      }
    })
  } else {
    res.json({status: 1, message: check.message})
  }
})
// 显示所有用户
router.post('/showUser', function (req, res, next) {
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'})
  }
  if (!req.body.token) {
    res.json({status: 1, message: '登陆出错'})
  }
  if (!req.body.id) {
    res.json({status: 1, message: '用户传递错误'})
  }
  var check = checkAdminPower(req.body.username, req.body.token, req.body.id)
  if (check.error == 0) {
    user.findByUsername(req.body.username, function (err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        user.findAll(function (err, findUser) {
          res.json({status: 0, message: '获取成功', data: findUser})
        })
      } else {
        res.json({status: 1, message: '用户没有获得权限或者已经停用'})
      }
    })
  } else {
    res.json({status: 1, message: check.message})
  }
})
// 管理用户权限
router.post('/powerUpdate', function (req, res, next) {
  if (!req.body.userid) {
    res.json({status: 1, message: '用户id传递失败'})
  }
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'})
  }
  if (!req.body.token) {
    res.json({status: 1, message: '登陆出错'})
  }
  if (!req.body.id) {
    res.json({status: 1, message: '用户传递错误'})
  }
  var check = checkAdminPower(req.body.username, req.body.token, req.body.id)
  if (check.error == 0) {
    user.findByUsername(req.body.username, function (err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        user.update({_id: req.body.userid}, {userAdmin: true}, function (err, updateUser) {
          res.json({status: 0, message: '修改成功', data: updateUser})
        })
      } else {
        res.json({status: 1, message: '用户没有获得权限或者已经停用'})
      }
    })
  } else {
    res.json({status: 1, message: check.message})
  }
})
// 新增文章
router.post('/addArticle', function (req, res, next) {
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'})
  }
  if (!req.body.token) {
    res.json({status: 1, message: '登陆出错'})
  }
  if (!req.body.id) {
    res.json({status: 1, message: '用户传递错误'})
  }
  if (!req.body.articleTitle) {
    res.json({status: 1, message: '文章名称为空'})
  }
  if (!req.body.articleContext) {
    res.json({status: 1, message: '文章内容为空'})
  }
  var check = checkAdminPower(req.body.username, req.body.token, req.body.id)
  if (check.error == 0) {
    user.findByUsername(req.body.username, function (err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        var saveArticle = new article({
          articleTitle: req.body.articleTitle,
          articleContext: req.body.articleContext,
          articleTime: Date.now()
        })
        saveArticle.save(function (err) {
          if (err) {
            res.json({status: 1, message: err})
          } else {
            res.json({status: 0, message: '添加成功'})
          }
        })
      } else {
        res.json({status: 1, message: '用户没有获得权限或者已经停用'})
      }
    })
  } else {
    res.json({status: 1, message: check.message})
  }
})
// 删除文章
router.post('/delArticle', function (req, res, next) {
  if (!req.body.articleId) {
    res.json({status: 1, message: '文章id传递失败'})
  }
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'})
  }
  if (!req.body.token) {
    res.json({status: 1, message: '登陆出错'})
  }
  if (!req.body.id) {
    res.json({status: 1, message: '用户传递错误'})
  }
  var check = checkAdminPower(req.body.username, req.body.token, req.body.id)
  if (check.error == 0) {
    user.findByUsername(req.body.username, function (err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        article.remove({_id: req.body.articleId}, function (err, delArticle) {
          res.json({status: 0, message: '删除成功', data: delArticle})
        })
      } else {
        res.json({status: 1, message: '用户没有获得权限或者已经停用'})
      }
    })
  } else {
    res.json({status: 1, message: check.message})
  }
})
// 新增主页推荐
router.post('/addRecommend', function (req, res, next) {
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'})
  }
  if (!req.body.token) {
    res.json({status: 1, message: '登陆出错'})
  }
  if (!req.body.id) {
    res.json({status: 1, message: '用户传递错误'})
  }
  if (!req.body.recommendImg) {
    res.json({status: 1, message: '推荐图片为空'})
  }
  if (!req.body.recommendSrc) {
    res.json({status: 1, message: '推荐跳转地址为空'})
  }
  if (!req.body.recommendTitle) {
    res.json({status: 1, message: '推荐标题为空'})
  }
  var check = checkAdminPower(req.body.username, req.body.token, req.body.id)
  if (check.error == 0) {
    user.findByUsername(req.body.username, function (err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        var saveRecommend = new recommend({
          recommendImg: req.body.recommendImg,
          recommendSrc: req.body.recommendSrc,
          recommendTitle: req.body.recommendTitle
        })
        saveRecommend.save(function (err) {
          if (err) {
            res.json({status: 1, message: err})
          } else {
            res.json({status: 0, message: '保存成功'})
          }
        })
      } else {
        res.json({status: 1, message: '用户没有获得权限或者已经停用'})
      }
    })
  } else {
    res.json({status: 1, message: check.message})
  }
})
// 删除热点信息
router.post('/delRecommend', function (req, res, next) {
  if (!req.body.recommendId) {
    res.json({status: 1, message: '热点信息id传递失败'})
  }
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'})
  }
  if (!req.body.token) {
    res.json({status: 1, message: '登陆出错'})
  }
  if (!req.body.id) {
    res.json({status: 1, message: '用户传递错误'})
  }
  var check = checkAdminPower(req.body.username, req.body.token, req.body.id)
  if (check.error == 0) {
    user.findByUsername(req.body.username, function (err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        recommend.remove({_id: req.body.recommendId}, function (err, delRecommend) {
          res.json({status: 0, message: '删除成功', data: delRecommend})
        })
      } else {
        res.json({status: 1, message: '用户没有获得权限或者已经停用'})
      }
    })
  } else {
    res.json({status: 1, message: check.message})
  }
})

function checkAdminPower (name, token, id) {
  if (token == getMD5Password(id)) {
    return {error: 0, message: '用户登录成功'}
  } else {
    return {error: 1, message: '用户登录错误'}
  }
}

// 获取MD5值
function getMD5Password (id) {
  var md5 = crypto.createHash('md5');
  var token_before = id + init_token
  // res.json(userSave[0]._id)
  return md5.update(token_before).digest('hex')
}

module.exports = router