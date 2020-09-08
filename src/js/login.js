import $ from 'jquery'
import 'jquery.cookie'
import {setStudentsMes, clearStudentMes} from './students_mes'
/*
 *@author:   huimei
 *@function: 登录
 *@params:
 */
// hahahah
$('.login-page').hide();
let loginSuccess = false;
document.oncontextmenu = function(e) {
  let event = e || window.event;
  event.preventDefault();
}
$('.avatar').on('mousedown' ,(e) => {
  let event = e || window.event;
  if (loginSuccess) {
    if (event.button === 2) {
      $('.login-out').toggleClass('show');
    }
  }else {
    if (event.button === 0) {
      $('.login-page').fadeIn(100);
    }
  }
});
// 退出登录
$('.login-out').click(()=> {
  clearStudentMes();
  $('.login-out').toggleClass('show');
  loginSuccess = false;
})
// 关闭登录窗口
$('.close-btn').click(() => {
  $('.login-page').fadeOut(100);
});

$('.login-page').mousedown((e) => {
  // e.pageX
  const positionDiv = $('.login-page').offset();
  const distenceX = e.pageX - positionDiv.left;
  const distenceY = e.pageY - positionDiv.top;
  // alert(distenceX)
  // alert(positionDiv.left);

  $(document).mousemove((e) => {
    $('.login-page').css('cursor', 'pointer');
    let x = e.pageX - distenceX;
    let y = e.pageY - distenceY;

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

    if (distenceX < ($('.loginBox').position().left) || distenceY < ($('.loginBox').position().top)) {
      $('.login-page').css({
        left: `${x}px`,
        top: `${y}px`,
      });
    }
  });

  $(document).mouseup(() => {
    $(document).off('mousemove');
    $('.login-page').css('cursor', 'default');
  });
});

// 登录
$('.login-btn').click(() => {
  const name = $('[name=username]').val();
  const pwd = $('[name=password]').val();
  if (name == '') {
    $('#login-tip').text('用户名没填就想登录???');
    setTimeout(() => {
      $('#login-tip').text(' ');
    }, 2000);
    return false;
  }
  if (pwd == '') {
    $('#login-tip').text('密码还没填喔!!!');
    setTimeout(() => {
      $('#login-tip').text(' ');
    }, 2000);
    return false;
  }
  $.ajax({
    url: '/api/login',
    type: 'POST',
    data: JSON.stringify({
      username: name,
      password: pwd,
    }),
    dataType: 'json',
    headers: {
      'Content-Type': 'application/json',
    },
    success(data) {
      if (data.success) {
        if (data.data.roleId == 2) {
          $('.filter').hide();
          $.cookie('token', data.data.token);
          $('.login-page').hide();
          $('.login-avatar').html('&#xe63c;');
          $('.login-avatar').css('color', 'skyblue');
          $('[name=username]').val('');
          $('[name=password]').val('');
          $.cookie('token', data.data.token, {
            expires: data.data.expireTime,
          });
          loginSuccess = true;
          setStudentsMes(1);
        } else {
          $('#login-tip').text('用户不存在');
          setTimeout(() => {
            $('#login-tip').text(' ');
          }, 2000);
        }
      } else {
        $('#login-tip').text(data.message);
        setTimeout(() => {
          $('#login-tip').text(' ');
        }, 2000);
      }
    },
  });
});

$('[name=username], [name=password]').on('keyup', function(e) {
  let event = e || window.event;
  if (event.keyCode === 13) {
    $('.login-btn').click();
  }
})