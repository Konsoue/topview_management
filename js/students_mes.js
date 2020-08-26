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
/* @params:
  ctrlSure, shiftSure 用于判断是否按下ctrl 或 shfit键
  checkArr 用于记录选中的项
  shiftFirst 用于记录按shift选择时的初始位置
*/
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


/* 加载学生信息 */
/* @author: 陈泳充 */
/* @params:
  page用于记录当前页数,
  group用于记录当前组别
  pageNum是总页数
  sInputValue是搜索框内容
  studentsDetails用于记录学生的个人介绍、技能、工作室了解等信息
  sStatus用于记录状态
*/
let page = null;
let group = null;
let pageNum = null;
let sInputValue = "";
let studentsDetails = [];
let sStatus = null;
const setStudentsMes = (current, size, sName = "", sNumber = "", group = null, sStatus = null) => {
  $.ajax({
    url: "/api/admin/selectStudentInfo",
    type: "POST",
    dateType: 'json',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': $.cookie('token')
    },
    data: JSON.stringify({
      "current": current,
      "size": size,
      "name": sName,
      "studentNumber": sNumber,
      "groupId": group,
      "status": sStatus
    }),
    success: function (data) {
      // 更新 page 和 studentsDetails
      page = data.data.current;
      studentsDetails = [];
      // 加载数据条数
      $('.main-enroll .pages .total').html(`已加载 ${data.data.total} 条数据`);
      // 加载分页页面
      if (data.data.total) {
        pageNum = data.data.pages;
        let pageCon = '<li class="icon">&#xe744</li>';
        for (let i = 0; i < pageNum; i++) {
          pageCon += data.data.current === i + 1 ? `<li class='current'>${i + 1}</li>` : `<li>${i + 1}</li>`;
        }
        pageCon += '<li class="icon">&#xe743</li>';
        $('.main-enroll .pages .page').html(pageCon);
      } else {
        $('.main-enroll .pages .page').html("");
      }
      // 加载学生信息
      let arr = data.data.records
      let len = arr.length;
      let studentCon = ''
      for (let i = 0; i < len; i++) {
        studentCon +=
          `<tr>
              <th>${arr[i]["name"]}</th>
              <th>${arr[i]["sex"] === 0 ? '男' : '女'}</th>
              <th>${arr[i]["collegeName"]}</th>
              <th>${arr[i]["studentNumber"]}</th>
              <th>${arr[i]["groupName"]}</th>
              <th>${arr[i]["phone"]}</th>
              <th>${arr[i]["status"] === 0 ? '未通过' : '已通过'}</th>
              <th><a href="javascript:void(0)">点击查看</a></th>
            </tr>`;
        studentsDetails.push({
          name: arr[i]["name"],
          introduction: arr[i]["introduction"],
          skill: arr[i]["skill"],
          impression: arr[i]["impression"]
        })
      }
      $('.main-enroll .students tbody').html("");
      $('.main-enroll .students tbody').html(studentCon);
    },
  })
}

setTimeout(function () {
  setStudentsMes(1, 12);
}, 2000)


/* 查看学生其他信息 */
/* @author: 陈泳充 */
$('.main-enroll .students tbody').on("click", "tr a", function (e) {
  e.stopPropagation()
  let details = studentsDetails[$(this).parent().parent().index()];
  $(".students-details .content .name span").html(details["name"]);
  $(".students-details .content .introduction p").html(details["introduction"]);
  $(".students-details .content .skill p").html(details["skill"]);
  $(".students-details .content .impression p").html(details["impression"]);

  $(".students-details").fadeIn(200);

  function temp(e) {
    if (e.target.getAttribute("class") === "students-details") {
      $(".students-details").fadeOut(200);
      $(".students-details").off("click", temp);
    }
  }
  $(".students-details").on("click", temp);
})

/* 下拉框筛选学生*/
/* @author: 陈泳充 */
$(".main-enroll .head #groups").on("click", function () {
  let value = $(this).find("option:selected").val();
  let groupIds = {
    "全部": null,
    "前端": 1,
    "后台": 2,
    "安卓": 3,
    "IOS": 4,
    "机器学习": 5
  }
  if (groupIds[value] === group) {
    return;
  }
  group = groupIds[value];
  isNaN(sInputValue) ? setStudentsMes(1, 12, sInputValue, "", group, sStatus) : setStudentsMes(1, 12, "", sInputValue, group, sStatus);
})
$(".main-enroll .head #status").on("click", function () {
  let value = $(this).find("option:selected").val();
  let statusArr = {
    "全部": null,
    "未通过": 0,
    "已通过": 1,
  }
  if (statusArr[value] === sStatus) {
    return;
  }
  sStatus = statusArr[value];
  isNaN(sInputValue) ? setStudentsMes(1, 12, sInputValue, "", group, sStatus) : setStudentsMes(1, 12, "", sInputValue, group, sStatus);
})

/* 模糊搜索学生 */
/* @author: 陈泳充 */
$(".main-enroll .head input").one("focus", function () {
  let flag = 0;
  $("body").on({
    "keydown": function (e) {
      let value = $(".main-enroll .head input").val().trim();
      if (e.keyCode === 13) {
        flag = 1;
        isNaN(value) ? setStudentsMes(1, 12, value, "", group, sStatus) : setStudentsMes(1, 12, "", value, group, sStatus);
        sInputValue = value;
      }
    },
    "keyup": function (e) {
      let value = $(".main-enroll .head input").val().trim();
      if (e.keyCode === 8) {
        if (!value && flag === 1) {
          setStudentsMes(1, 12, "", "", group, sStatus);
          flag = 0;
          sInputValue = "";
        }
      }
    }
  })
});

/* 分页 */
/* @author: 陈泳充 */
$('.main-enroll .pages .page').on("mouseenter", "li", function () {
  if ((page === 1 && $(this).index() === 0) || (page === pageNum && $(this).index() === pageNum + 1)) {
    return;
  }
  if ($(this).attr('class') !== "current") {
    $(this).addClass("mouse-enter");
  }
  $('.main-enroll .pages .page').one("mouseout", "li", function () {
    $(this).removeClass("mouse-enter");
  })
})


$('.main-enroll .pages .page').on("click", "li", function () {
  if ((page === 1 && $(this).index() === 0) || (page === pageNum && $(this).index() === pageNum + 1)) {
    return;
  }
  if ($(this).attr('class') === "mouse-enter") {
    if ($(this).index() === 0) {
      page -= 1;
      page = page < 1 ? 1 : page;
    } else if ($(this).index() === pageNum + 1) {
      page += 1;
      page = page > pageNum ? pageNum : page;
    } else {
      page = $(this).index();
    }
    isNaN(sInputValue) ? setStudentsMes(page, 12, sInputValue, "", group, sStatus) : setStudentsMes(page, 12, "", sInputValue, group, sStatus);
  }
})