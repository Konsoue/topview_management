import $ from 'jquery'
import {groupId} from './interview'
/* 左侧栏拖动 */
/* @author: 陈泳充 */
$('.scalable').width(localStorage.getItem('scalableWidth') || parseInt($('.scalable').width(), 10));

$('.separator').on('mousedown', (e) => {
  const startX = e.clientX;
  const startWidth = parseInt($('.scalable').width(), 10);

  function onDrag(e) {
    $('html').css('cursor', 'col-resize');
    $('html').css('user-select', 'none');
    $('.scalable').width(startWidth + e.clientX - startX);
  }

  $('html').on('mousemove', onDrag);

  $('html').one('mouseup', () => {
    $('html').css('cursor', '');
    $('html').css('user-select', '');
    localStorage.setItem('scalableWidth', parseInt($('.scalable').width(), 10));
    $('html').off('mousemove', onDrag);
  });
});

// 分页
// @author: huimei
$('.enroll-card').click(() => {
  $('.enroll-card').addClass('leftcard');
  $('.interview-card').removeClass('leftcard');
  $('.main-enroll').show();
  $('.main-interview').hide();
});
$('.interview-card').click(() => {
  if (!$('.interview-card').hasClass('leftcard')) {
    $(`[groups=${groupId}]`).trigger('click'); // 获取上次观看的页面
  }
  $('.enroll-card').removeClass('leftcard');
  $('.interview-card').addClass('leftcard');
  $('.main-enroll').hide();
  $('.main-interview').show();
});
