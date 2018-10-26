var express = require('express');
var router = express.Router();
var user = require('../models/user');
var crypto = require('crypto');
var movie = require('../models/movie');
var mail = require('../models/mail');
var comment = require('../models/comment');
const init_token = 'TKL02o'

/* GET users listing. */
// 用户登录接口
router.post('/login', function(req, res, next) {
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'})
  }
  if (!req.body.password) {
    res.json({status: 1, message: '密码为空'})
  }
  user.findUserLogin(req.body.username, req.body.password, function (err, userSave) {
    if (userSave.length != 0) {
      var token_after = getMD5Password(userSave[0]._id)
      res.json({status: 0, data: { token: token_after, user: userSave }, message: '用户登录成功'})
    } else {
      res.json({status: 1, message: '用户名或者密码错误'})
    }
  })
});
// 用户注册接口
router.post('/register', function(req, res, next) {
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'})
  }
  if (!req.body.password) {
    res.json({status: 1, message: '密码为空'})
  }
  if (!req.body.userMail) {
    res.json({status: 1, message: '邮箱为空'})
  }
  if (!req.body.userPhone) {
    res.json({status: 1, message: '手机为空'})
  }
  user.findByUsername(req.body.username, function (err, userSave) {
    if (userSave.length != 0) {
      // 返回错误信息
      res.json({status: 1, message: '用户已注册'})
    } else {
      var registerUser = new user({
        username: req.body.username,
        password: req.body.password,
        userMail: req.body.userMail,
        userPhone: req.body.userPhone,
        userAdmin: 0,
        userPower: 0,
        userStop: 0
      })
      registerUser.save(function () {
        res.json({status: 0, message: '注册成功'})
      })
    }
  })
});
// 用户提交评论
router.post('/postComment', function (req, res, next) {
  if (!req.body.username) {
    var username = '匿名用户'
  }
  if (!req.body.movie_id) {
    res.json({status: 1, message: '电影id为空'})
  }
  if (!req.body.context) {
    res.json({status: 1, message: '评论内容为空'})
  }

  var saveComment = new comment({
    movie_id: req.body.movie_id,
    username: req.body.username ? req.body.username : username,
    context: req.body.context,
    check: 1
  })
  saveComment.save(function (err) {
    if (err) {
      res.json({status: 1, message: err})
    } else {
      res.json({status: 0, message: '评论成功'})
    }
  })
})
// 用户点赞
router.post('/support', function(req, res, next) {
  if (!req.body.movie_id) {
    res.json({status: 1, message: '电影id传递失败'})
  }
  movie.findById(req.body.movie_id, function (err, supportMovie) {
    movie.update({_id: req.body.movie_id}, {movieNumSuppose: supportMovie.movieNumSuppose + 1}, function (err) {
      if (err) {
        res.json({status: 1, message: '点赞失败', data: err})
      }
      res.json({status: 0, message: '点赞成功'})
    })
  })
});
// 用户找回密码
router.post('/findPassword', function(req, res, next) {
  if (req.body.repassword) {
    // 当存在老密码时，需要验证其登陆情况或者验证其code
    if (req.body.token) {
      // 当存在code登录状态时，验证其状态
      if (!req.body.user_id) {
        res.json({status: 1, message: '用户登录错误'})
      }
      if (!req.body.password) {
        res.json({status: 1, message: '用户老密码错误'})
      }
      if (req.body.token == getMD5Password(req.body.user_id)) {
        user.findOne({ _id: req.body.user_id, password: req.body.password }, function (err, checkUser) {
          if (checkUser) {
            user.update({ _id: req.body.user_id }, { password: req.body.repassword }, function (err, userUpdate) {
              if (err) {
                res.json({status: 1, message: '更改错误', data: err})
              }
              res.json({status: 0, message: '更改成功', data: userUpdate})
            })
          } else {
            res.json({status: 1, message: '用户老密码错误'})
          }
        })
      }
    } else {
      // 不存在code时，直接验证mail和phone
      user.findUserPassword(req.body.username, req.body.userMail, req.body.userPhone, function (err, userFound) {
        if (userFound.length != 0) {
          user.update({_id: userFound[0]._id}, {password: req.body.repassword}, function (err, userUpdate) {
            if (err) {
              res.json({status: 1, message: '更改错误', data: err})
            }
            res.json({status: 0, message: '更改成功', data: userUpdate})
          })
        } else {
          res.json({status: 1, message: '信息错误'})
        }
      })
    }
  } else {
    // 验证mail和phone，返回验证成功提示和提交的字段，用于之后改密码的操作
    if (!req.body.username) {
      res.json({status: 1, message: '用户名为空'})
    }
    if (!req.body.userMail) {
      res.json({status: 1, message: '用户邮箱为空'})
    }
    if (!req.body.userPhone) {
      res.json({status: 1, message: '用户名手机为空'})
    }
    user.findUserPassword(req.body.username, req.body.userMail, req.body.userPhone, function (err, userFound) {
      if (userFound.length != 0) {
        res.json({status: 0, message: '验证成功，请修改密码', data: {username: req.body.username, userMail: req.body.userMail, userPhone: req.body.userPhone}})
      } else {
        res.json({status: 1, message: '信息错误'})
      }
    })
  }
});
// 用户下载返回下载地址
router.post('/download', function (req, res, next) {
  if (!req.body.movie_id) {
    res.json({status: 1, message: '电影id传递失败'})
  }
  movie.findById(req.body.movie_id, function (err, supportMovie) {
    res.json({message: supportMovie})
    movie.update({_id: req.body.movie_id}, {movieNumDownload: supportMovie.movieNumDownload + 1}, function (err) {
      if (err) {
        res.json({status: 1, message: '下载失败', data: err})
      }
      res.json({status: 0, message: '下载成功', data: supportMovie.movieDownload})
    })
  })
})
// 用户发送站内信
router.post('/sendEmail', function(req, res, next) {
  if (!req.body.token) {
    res.json({status: 1, message: '用户登录状态错误'})
  }
  if (!req.body.user_id) {
    res.json({status: 1, message: '用户登录状态出错'})
  }
  if (!req.body.toUserName) {
    res.json({status: 1, message: '未选择相关的用户'})
  }
  if (!req.body.title) {
    res.json({status: 1, message: '标题不能为空'})
  }
  if (!req.body.context) {
    res.json({status: 1, message: '内容不能为空'})
  }
  if (req.body.token == getMD5Password(req.body.user_id)) {
    user.findByUsername(req.body.toUserName, function (err, toUser) {
      if (toUser.length != 0) {
        var NewEmail = new mail({
          fromUser: req.body.user_id,
          toUser: toUser[0]._id,
          fromUserName: req.body.fromUserName,
          toUserName: req.body.toUsername,
          title: req.body.title,
          context: req.body.context
        })
        NewEmail.save(function () {
          res.json({status: 0, message: '发送成功'})
        })
      } else {
        res.json({status: 1, message: '您发送的对象不存在'})
      }
    })
  } else {
    res.json({status: 1, message: '用户登录错误'})
  }
});
// 用户显示站内信，其中的receive参数值为1时是发送的内容，值为2时是收到的内容
router.post('/showEmail', function (req, res, next) {
  if (!req.body.token) {
    res.json({status: 1, message: '用户登录状态错误'})
  }
  if (!req.body.user_id) {
    res.json({status: 1, message: '用户登录状态出错'})
  }
  if (!req.body.receive) {
    res.json({status: 1, message: '参数出错'})
  }
  if (req.body.token == getMD5Password(req.body.user_id)) {
    if (req.body.receive == '0') {
      mail.findByFromUserId(req.body.user_id, function (err, sendMail) {
        res.json({status: 0, message: '获取成功', data: sendMail})
      })
    } else if (req.body.receive == '1') {
      mail.findByToUserId(req.body.user_id, function (err, receiveMail) {
        res.json({status: 0, message: '获取成功', data: receiveMail})
      })
    }
  } else {
    res.json({status: 1, message: '用户登录错误'})
  }
})

// 获取MD5值
function getMD5Password (id) {
  var md5 = crypto.createHash('md5');
  var token_before = id + init_token
  // res.json(userSave[0]._id)
  return md5.update(token_before).digest('hex')
}

module.exports = router;
