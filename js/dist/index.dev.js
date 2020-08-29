"use strict";

/* 左侧栏拖动 */

/* @author: 陈泳充 */
$(".scalable").width(localStorage.getItem("scalableWidth") || parseInt($(".scalable").width(), 10));
$(".separator").on("mousedown", function (e) {
  var startX = e.clientX;
  var startWidth = parseInt($(".scalable").width(), 10);

  function onDrag(e) {
    $("html").css("cursor", "col-resize");
    $(".scalable").width(startWidth + e.clientX - startX);
  }

  $("html").on("mousemove", onDrag);
  $("html").one("mouseup", function () {
    $("html").css("cursor", "");
    localStorage.setItem("scalableWidth", parseInt($(".scalable").width(), 10));
    $("html").off("mousemove", onDrag);
  });
}); // 分页
// @author: huimei

$('.enroll-card').click(function () {
  $('.enroll-card').addClass('leftcard');
  $('.interview-card').removeClass('leftcard');
  $('.main-enroll').show();
  $('.main-interview').hide();
});
$('.interview-card').click(function () {
  $('.enroll-card').removeClass('leftcard');
  $('.interview-card').addClass('leftcard');
  $('.main-enroll').hide();
  $('.main-interview').show();
});