let startX, startWidth;

const getScalableDivWidth = () => {
  return startWidth = parseInt($(".scalable").width(), 10);
};

startWidth = localStorage.getItem("scalableWidth") || getScalableDivWidth();

let scalable = $(".scalable");
let separator = $(".separator");
let body = $("html");

$(".scalable").width(startWidth);

const onDrag = (e) => {
  separator.css("cursor", "col-resize");
  scalable.width(startWidth + e.clientX - startX);
};

const stopDrag = () => {
  separator.css("cursor", "");
  localStorage.setItem("scalableWidth", getScalableDivWidth())
  body.off("mousemove", onDrag);
  body.off("mouseup", stopDrag);
};

const startDrag = (e) => {
  startX = e.clientX;
  startWidth = getScalableDivWidth();
  body.on("mousemove", onDrag);
  body.on("mouseup", stopDrag);
};

separator.on("mousedown", startDrag);

// 分页
// @author: huimei
$('.enroll-card').click(function() {
  $('.enroll-card').addClass('leftcard');
  $('.interview-card').removeClass('leftcard');
  $('.main-enroll').show();
  $('.main-interview').hide();
})
$('.interview-card').click(function() {
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
$('.avatar').click(function() {
  $('.login-page').slideToggle()
})

$('.login-page').mousedown(function(e) {
  
  // e.pageX
  var positionDiv = $('.login-page').offset();
  var distenceX = e.pageX - positionDiv.left;
  var distenceY = e.pageY - positionDiv.top;
  //alert(distenceX)
  // alert(positionDiv.left);

  $(document).mousemove(function(e) {
      $('.login-page').css('cursor','pointer');
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

      $('.login-page').css({
          'left': x + 'px',
          'top': y + 'px'
      });
  });

  $(document).mouseup(function() {
      $(document).off('mousemove');
      $('.login-page').css('cursor','default');
  });
});