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
  $("html").on("mousemove", function (e) {
    $(this).css("cursor", "col-resize");
    let result = studentsStartWidth + e.clientX - studentsStartX;
    result = result < 30 ? 30 : result;
    result = result > 400 ? 400 : result;
    that.parent().width(result);
  });
  $("html").one("mouseup", function () {
    $(this).css("cursor", "");
    $("html").off("mousemove");
    widthArr[index] = that.parent().width();
    localStorage.setItem("studentsWidth", JSON.stringify(widthArr));
  });
})