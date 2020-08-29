"use strict";

/*
 *@author:   huimei
 *@function: 登录
 *@params:   
 */
$('.login-page').hide();
$('.avatar').click(function () {
  $('.login-page').slideToggle();
});
$('.login-page').mousedown(function (e) {
  // e.pageX
  var positionDiv = $('.login-page').offset();
  var distenceX = e.pageX - positionDiv.left;
  var distenceY = e.pageY - positionDiv.top; //alert(distenceX)
  // alert(positionDiv.left);

  $(document).mousemove(function (e) {
    $('.login-page').css('cursor', 'pointer');
    var x = e.pageX - distenceX;
    var y = e.pageY - distenceY;

    if (x < 0) {
      x = 0;
    } else if (x > $(document).width() - $('.login-page').outerWidth(true)) {
      x = $(document).width() - $('.login-page').outerWidth(true);
    }

    if (y < 0) {
      y = 0;
    } else if (y > $(document).height() - $('.login-page').outerHeight(true)) {
      y = $(document).height() - $('.login-page').outerHeight(true);
    }

    if (distenceX < $(".loginBox").position().left || distenceY < $(".loginBox").position().top) {
      $('.login-page').css({
        'left': x + 'px',
        'top': y + 'px'
      });
    }
  });
  $(document).mouseup(function () {
    $(document).off('mousemove');
    $('.login-page').css('cursor', 'default');
  });
}); // 登录

$('.login-btn').click(function () {
  var baseUrl = 'https://server1.backend.topviewclub.cn';
  var username = $('[name=username]').val();
  var password = $('[name=password]').val();

  if (username == '') {
    alert('用户名不可为空');
    return false;
  }

  if (password == '') {
    alert('密码不可为空');
    return false;
  }

  $.ajax({
    url: baseUrl + '/api/login',
    type: 'POST',
    data: {
      username: 'topview',
      password: 'topview'
    },
    dataType: 'json',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': $.cookie()
    },
    success: function success(data) {
      console.log(JSON.parse(data));
    }
  });
});