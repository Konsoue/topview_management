/* 左侧栏拖动 */
/* @author: 陈泳充 */
$(".scalable").width(localStorage.getItem("scalableWidth") || parseInt($(".scalable").width(), 10));

$(".separator").on("mousedown", function (e) {
  let startX = e.clientX;
  let startWidth = parseInt($(".scalable").width(), 10);

  function onDrag(e) {
    $("html").css("cursor", "col-resize");
    $(".scalable").width(startWidth + e.clientX - startX);
  }

  $("html").on("mousemove", onDrag);

  $("html").one("mouseup", function () {
    $("html").css("cursor", "");
    localStorage.setItem("scalableWidth", parseInt($(".scalable").width(), 10))
    $("html").off("mousemove", onDrag);
  });
});


// 分页
// @author: huimei
$('.enroll-card').click(function () {
  $('.enroll-card').addClass('leftcard');
  $('.interview-card').removeClass('leftcard');
  $('.main-enroll').show();
  $('.main-interview').hide();
})
$('.interview-card').click(function () {
  $('.enroll-card').removeClass('leftcard');
  $('.interview-card').addClass('leftcard');
  $('.main-enroll').hide();
  $('.main-interview').show();
})

/*
 *@author:   huimei
 *@function: 控制登录框
 *@params:   wu
 */
$('.login-page').hide();
$('.avatar').click(function () {
  $('.login-page').slideToggle()
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