/* 学生信息宽度拖动 */
/* @author: 陈泳充 */
if (localStorage.getItem("studentsWidth") === null) {
  localStorage.setItem("studentsWidth", JSON.stringify(["5%", "5%", "10%", "10%", "12%", "12%", "10%", null]));
}
let widthArr = JSON.parse(localStorage.getItem("studentsWidth"));
for (let i = 0; i < 8; i++) {
  $('.students thead th').eq(i).width(widthArr[i]);
}

$('.students thead tr').on('mousedown', '.move-loc', function (e) {
  let that = $(this);
  let index = that.parent().index();
  let studentsStartX = e.clientX;
  let studentsStartWidth = parseInt(that.parent().width(), 10);

  function studentsDrag(e) {
    $(this).css("cursor", "col-resize");
    let result = studentsStartWidth + e.clientX - studentsStartX;
    result = result < 30 ? 30 : result;
    result = result > 400 ? 400 : result;
    that.parent().width(result);
  }
  $("html").on("mousemove", studentsDrag);

  $("html").one("mouseup", function () {
    $(this).css("cursor", "");
    $("html").off("mousemove", studentsDrag);
    widthArr[index] = that.parent().width();
    localStorage.setItem("studentsWidth", JSON.stringify(widthArr));
  });
})

/* 学生信息全选 */
/* @author: 陈泳充 */
let [ctrlSure, shiftSure] = [0, 0];
let checkArr = [];
let shiftFirst = null;

function getKeyCode(e) {
  ctrlSure = e.keyCode === 17 ? 1 : 0;
  shiftSure = e.keyCode === 16 ? 1 : 0;
}

$("html").one("keydown", getKeyCode);
$("html").on('keyup', function () {
  $("html").one("keydown", getKeyCode);
  [ctrlSure, shiftSure] = [0, 0];
  shiftFirst = null;
})

$('.main-enroll .students tbody').on("click", "tr", function () {
  if (ctrlSure) {
    $(this).toggleClass("checked");
    let index = checkArr.indexOf($(this).index());
    index === -1 ? checkArr.push($(this).index()) : checkArr.splice(index, 1);
  } else if (shiftSure) {
    if (checkArr.length !== 0) {
      shiftFirst = shiftFirst !== null ? shiftFirst : checkArr[checkArr.length - 1];
      $('.main-enroll .students tbody tr').removeClass('checked');
      let [first, last] = [shiftFirst, $(this).index()];
      if (last < first) {
        first = [last, last = first][0];
      }
      checkArr = [];
      for (let i = first; i <= last; i++) {
        $('.main-enroll .students tbody tr').eq(i).addClass('checked');
        checkArr.push(i);
      }
    }
  } else {
    if (checkArr.length > 1) {
      $(this).siblings().removeClass('checked');
      $(this).addClass("checked");
      checkArr = [$(this).index()];
    } else {
      $(this).siblings().removeClass('checked');
      $(this).toggleClass("checked");
      checkArr = checkArr.indexOf($(this).index()) === -1 ? [$(this).index()] : [];
    }
  }
})


/* 查看学生其他信息 */
$('.main-enroll .students tbody').on("click", "tr a", function (e) {
  e.stopPropagation()
  // 等接口
})