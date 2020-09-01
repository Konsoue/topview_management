/*
 *@author:   huimei
 *@function: 登录
 *@params:
 */
$('.login-page').hide();
let loginSuccess = false;
$('.avatar').click(function () {
    $('.login-page').fadeIn(100)
})
$('.close-btn').click(function() {
  $('.login-page').fadeOut(100)
})

$('.login-page').mousedown(function (e) {

  // e.pageX
  var positionDiv = $('.login-page').offset();
  var distenceX = e.pageX - positionDiv.left;
  var distenceY = e.pageY - positionDiv.top;
  //alert(distenceX)
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

    if (distenceX < ($(".loginBox").position().left) || distenceY < ($(".loginBox").position().top)) {
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
});

// 登录
$('.login-btn').click(function() {
  const name = $('[name=username]').val();
  const pwd = $('[name=password]').val()
  if (name == '') {
    $('#login-tip').text('用户名没填就想登录???');
    setTimeout(function() {
      $('#login-tip').text(" ");
    },2000)
    return false;
  }
  if (pwd == '') {
    $('#login-tip').text('密码还没填喔!!!');
    setTimeout(function() {
      $('#login-tip').text(" ");
    },2000)
    return false;
  }
  $.ajax({
    url: '/api/login',
    type: 'POST',
    data: JSON.stringify({
      username: name,
      password: pwd
    }),
    dataType: 'json',
    headers: {
      'Content-Type': 'application/json',
    },
    success: function(data) {
      if(data.success) {
        if(data.data.roleId == 2) {
          console.log(data);
          $('.filter').hide();
          $.cookie("token",data.data.token);
          $('.login-page').hide();
          $('.login-avatar').html('&#xe63c;');
          $('.login-avatar').css('color','skyblue');
          $('[name=username]').val("");
          $('[name=password]').val("");
          $.cookie('token',data.data.token , {
            expires : data.data.expireTime,
          });

          setStudentsMes(1,12);
        }else {
          $('#login-tip').text('用户不存在');
          setTimeout(function() {
            $('#login-tip').text(" ");
          },2000)
        }
      }else {
        $('#login-tip').text(data.message);
        setTimeout(function() {
          $('#login-tip').text(" ");
        },2000)
      }
    }
  })
})