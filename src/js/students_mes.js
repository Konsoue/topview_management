import $ from 'jquery'
/* 学生信息宽度拖动 */
/* @author: 陈泳充 */

if (localStorage.getItem('studentsWidth') === null) {
  localStorage.setItem('studentsWidth', JSON.stringify(['50px', '8%', '8%', '10%', '10%', '12%', '12%', '8%', '100px', null]));
}
const widthArr = JSON.parse(localStorage.getItem('studentsWidth'));
for (let i = 0; i < 9; i++) {
  $('.students thead th').eq(i).width(widthArr[i]);
}

$('.students thead tr').on('mousedown', '.move-loc', function (e) {
  const that = $(this);
  const index = that.parent().index();
  const studentsStartX = e.clientX;
  const studentsStartWidth = parseInt(that.parent().width(), 10);

  function studentsDrag(e) {
    $(this).css('cursor', 'col-resize');
    $('html').css('user-select', 'none');
    let result = studentsStartWidth + e.clientX - studentsStartX;
    result = result < 30 ? 30 : result;
    that.parent().width(result);
  }
  $('html').on('mousemove', studentsDrag);

  $('html').one('mouseup', function () {
    $(this).css('cursor', '');
    $('html').css('user-select', '');
    $('html').off('mousemove', studentsDrag);
    widthArr[index] = that.parent().width();
    localStorage.setItem('studentsWidth', JSON.stringify(widthArr));
  });
});

/* 学生信息多选 */
/* @author: 陈泳充 */
/* @params:
  ctrlSure, shiftSure 用于判断是否按下ctrl 或 shfit键
  checkArr 用于记录选中的项
  shiftFirst 用于记录按shift选择时的初始位置
*/
let [ctrlSure, shiftSure] = [0, 0];
let checkArr = [];
let shiftFirst = null;
// 获取键盘按钮
function getKeyCode(e) {
  ctrlSure = e.keyCode === 17 ? 1 : 0;
  shiftSure = e.keyCode === 16 ? 1 : 0;
  if (shiftSure) {
    $("html").css("user-select", "none");
  }
}
$('html').one('keydown', getKeyCode);
$('html').on('keyup', () => {
  $('html').one('keydown', getKeyCode);
  $("html").css("user-select", "");
  [ctrlSure, shiftSure] = [0, 0];
  shiftFirst = null;
});
// 设置复选框样式
const setThStyle = () => {
  const size = parseInt(Math.floor(($('.main-enroll .pages').offset().top -
    $('.main-enroll .students thead').offset().top - 50) / 50), 10);
  const len = checkArr.length;
  // 加载头部复选框
  let content = len === size ? '&#xe6ca' : '&#xe6c9';
  len === 0 && (content = '&#xe6c8');
  $('.main-enroll .students thead tr em').html(content);
  // 加载单个复选框
  $('.main-enroll .students tbody tr em').html('&#xe6c8');
  $('.main-enroll .students tbody tr').removeClass('checked');
  for (let i = 0, len = checkArr.length; i < len; i++) {
    $(`.main-enroll .students tbody tr:eq(${checkArr[i]}) em`).html('&#xe6c9');
    $('.main-enroll .students tbody tr').eq(checkArr[i]).addClass('checked');
  }
}
// 点击头部复选框全选
$('.main-enroll .students thead tr em').on('click', function () {
  const size = parseInt(Math.floor(($('.main-enroll .pages').offset().top -
    $('.main-enroll .students thead').offset().top - 50) / 50), 10);
  const len = checkArr.length;
  if (len < size) {
    checkArr = len === 0 ? checkArr : [];
    for (let i = 0; i < size; i++) {
      checkArr.push(i);
    }
  } else {
    checkArr = [];
  }
  setThStyle();
})
// ctrl a 全选
$('html').on('keydown', function (e) {
  if (e.ctrlKey && e.keyCode == 65) {
    if ($(".enroll-card").attr("class") === "enroll-card leftcard") {
      e.preventDefault();
      const size = parseInt(Math.floor(($('.main-enroll .pages').offset().top -
        $('.main-enroll .students thead').offset().top - 50) / 50), 10);
      checkArr = [];
      for (let i = 0; i < size; i++) {
        checkArr.push(i);
      }
      setThStyle();
    }
  }
})


$('.main-enroll .students tbody').on('click', 'tr', function () {
  if (ctrlSure) {
    $(this).toggleClass('checked');
    const index = checkArr.indexOf($(this).index());
    index === -1 ? checkArr.push($(this).index()) : checkArr.splice(index, 1);
  } else if (shiftSure) {
    if (checkArr.length !== 0) {
      shiftFirst = shiftFirst !== null ? shiftFirst : checkArr[checkArr.length - 1];
      let [first, last] = [shiftFirst, $(this).index()];
      if (last < first) {
        first = [last, last = first][0];
      }
      checkArr = [];
      for (let i = first; i <= last; i++) {
        checkArr.push(i);
      }
    }
  } else if (checkArr.length > 1) {
    $(this).siblings().removeClass('checked');
    $(this).addClass('checked');
    checkArr = [$(this).index()];
  } else {
    $(this).siblings().removeClass('checked');
    $(this).toggleClass('checked');
    checkArr = checkArr.indexOf($(this).index()) === -1 ? [$(this).index()] : [];
  }

  setThStyle();
});


/* 加载学生信息 */
/* @author: 陈泳充 */
/* @params:
  page用于记录当前页数,
  group用于记录当前组别
  pageNum是总页数
  sInputValue是搜索框内容
  studentsDetails用于记录学生的个人介绍、技能、工作室了解等信息
  sStatus用于记录状态
  size用于记录每页条数
  ListMax表示下面除左右按键外最多显示的按钮数
*/

let page = null;
let group = null;
let pageNum = null;
let sInputValue = '';
let studentsDetails = [];
let sStatus = null;
let searchType = 1;
const setStudentsMes = (current, searchType, studentNumberOrNameLike = '', group = null, sStatus = null) => {

  const size = parseInt(Math.floor(($('.main-enroll .pages').offset().top -
    $('.main-enroll .students thead').offset().top - 50) / 50), 10);
  $.ajax({
    url: '/api/admin/selectStudentInfo',
    type: 'POST',
    dateType: 'json',
    headers: {
      'Content-Type': 'application/json',
      Authorization: $.cookie('token'),
    },
    data: JSON.stringify({
      current,
      size,
      type: searchType,
      studentNumberOrNameLike: studentNumberOrNameLike,
      groupId: group,
      status: sStatus,
    }),
    success(data) {
      // 初始化状态
      checkArr = [];
      $('.main-enroll .students thead tr em').html('&#xe6c8');
      page = data.data.current;
      studentsDetails = [];
      // 加载数据条数
      $('.main-enroll .pages .total').html(`已加载 ${data.data.total} 条数据`);
      // 加载分页页面
      if (data.data.total) {
        pageNum = data.data.pages;
        let pageCon = page === 1 ? '<li class="icon no-click">&#xe744</li>' : '<li class="icon">&#xe744</li>';
        const ListMax = 10; // 下面除左右按键外最多显示的按钮数
        // 页数过多时
        if (pageNum > ListMax) {
          // 取半数
          const half = Math.ceil(ListMax / 2); // 7
          // 半数页以内时
          if (page <= half) {
            for (let i = 1; i <= ListMax - 2; i++) {
              pageCon += data.data.current === i ?
                `<li class='current'>${i}</li>` :
                `<li>${i}</li>`;
            }
            pageCon += `<li>...</li><li>${pageNum}</li>`;
          }
          // 最后半数页时
          else if (page >= pageNum - half) {
            pageCon += '<li>1</li><li>...</li>';
            for (let i = page - ((ListMax - 2) - (pageNum - page + 1)); i <= pageNum; i++) {
              pageCon += data.data.current === i ?
                `<li class='current'>${i}</li>` :
                `<li>${i}</li>`;
            }
          }
          // 中间
          else {
            pageCon += '<li>1</li><li>...</li>';
            for (let i = page - 2; i <= page + 3; i++) {
              pageCon += data.data.current === i ?
                `<li class='current'>${i}</li>` :
                `<li>${i}</li>`;
            }
            pageCon += `<li>...</li><li>${pageNum}</li>`;
          }
        }
        // 页数小于ListMax时
        else {
          for (let i = 1; i <= pageNum; i++) {
            pageCon += data.data.current === i ?
              `<li class='current'>${i}</li>` :
              `<li>${i}</li>`;
          }
        }
        pageCon += page === pageNum ? '<li class="icon no-click">&#xe743</li>' : '<li class="icon">&#xe743</li>';
        $('.main-enroll .pages .page').html(pageCon);
      } else {
        $('.main-enroll .pages .page').html('');
      }
      // 加载学生信息
      const arr = data.data.records;
      const len = arr.length;
      let studentCon = '';
      const sArr = ['未笔试', '笔试通过', '已面试', '面试通过', '考核通过', '考核失败'];
      const sColor = ['#979797', '#42A512', '#F5A623', '#7ED321', '#337EFF', '#F82727'];
      for (let i = 0; i < len; i++) {
        studentCon
          += `<tr>
              <th><em class="icon">&#xe6c8</em></th>
              <th>${arr[i].name}</th>
              <th>${arr[i].sex === 0 ? '男' : '女'}</th>
              <th>${arr[i].collegeName}</th>
              <th>${arr[i].studentNumber}</th>
              <th>${arr[i].groupName}</th>
              <th>${arr[i].phone}</th>
              <th><span style="background-color:${sColor[arr[i].status]}"></span><i>${sArr[arr[i].status]}<i/></th>
              <th><a href="javascript:void(0)">点击查看</a></th>
              <th></th>
            </tr>`;
        studentsDetails.push({
          id: arr[i].userId,
          name: arr[i].name,
          introduction: arr[i].introduction,
          skill: arr[i].skill,
          impression: arr[i].impression,
        });
      }
      $('.main-enroll .students tbody').html('');
      $('.main-enroll .students tbody').html(studentCon);
    },
  });
};

/* 查看学生其他信息 */
/* @author: 陈泳充 */
$('.main-enroll .students tbody').on('click', 'tr a', function (e) {
  e.stopPropagation();
  const details = studentsDetails[$(this).parent().parent().index()];
  $('.students-details').html('');
  $('.students-details').html(
    `<div class="content">
      <div>
        <span>${details.name}</span>
      </div>
      <div>
        <span>个人介绍</span>
        <p>${details.introduction}</p>
      </div>
      <div>
        <span>掌握技能</span>
        <p>${details.skill}</p>
      </div>
      <div>
        <span>对工作室的了解</span>
        <p>${details.impression}</p>
      </div>
    </div>`,
  );
  $('.students-details').fadeIn(200);

  function temp(e) {
    if (e.target.getAttribute('class') === 'students-details') {
      $('.students-details').fadeOut(200);
      $('.students-details').off('click', temp);
    }
  }
  $('.students-details').on('click', temp);
});

/* 下拉框筛选学生 */
/* @author: 陈泳充 */
$('.main-enroll .head #groups').on('click', function () {
  const value = $(this).find('option:selected').val();
  const groupIds = {
    全部: null,
    前端: 1,
    后台: 2,
    安卓: 3,
    IOS: 4,
    机器学习: 5,
  };
  if (groupIds[value] === group) {
    return;
  }
  group = groupIds[value];

  setStudentsMes(1, searchType, sInputValue, group, sStatus);
});
$('.main-enroll .head #status').on('click', function () {
  const value = $(this).find('option:selected').val();
  const statusArr = {
    全部: null,
    未笔试: 0,
    笔试通过: 1,
    已面试: 2,
    面试通过: 3,
    考核通过: 4,
    考核失败: 5,
  };
  if (statusArr[value] === sStatus) {
    return;
  }
  sStatus = statusArr[value];
  setStudentsMes(1, searchType, sInputValue, group, sStatus);
});

$('.main-enroll .head #searchtype').on('click', function () {
  let value = $(this).find('option:selected').val();
  if (value === '姓名') {
    searchType = 1;
    $(".main-enroll .head input").attr('placeholder', '输入姓名，按Enter搜索')
  } else {
    searchType = 0;
    $(".main-enroll .head input").attr('placeholder', '输入学号，按Enter搜索')
  }
})

/* 模糊搜索学生 */
/* @author: 陈泳充 */
$('.main-enroll .head input').on('focus', () => {
  const temp_1 = (e) => {
    if (e.keyCode === 13) {
      const value = $('.main-enroll .head input').val().trim();
      // 内容为空不往下执行
      if (!value) {
        return;
      }
      const temp = isNaN(value); // 数字为false 汉字为true   0为学号 1为姓名
      if ((!temp && searchType === 1) || (temp && searchType === 0)) {
        $('.change-status').fadeIn(100);
        $('.change-status').html(`
          <div class="error-mes">
            请填写正确的搜索类型
          </div> `);
        setTimeout(() => {
          $('.change-status').fadeOut(100);
        }, 1000);
        return;
      }
      sInputValue = value;
      setStudentsMes(1, searchType, sInputValue, group, sStatus);
    }
  }

  const temp_2 = (e) => {
    const value = $('.main-enroll .head input').val().trim();
    if (e.keyCode === 8) {
      if (value.length === 1 && sInputValue) {
        setStudentsMes(1, searchType, '', group, sStatus);
        sInputValue = '';
      }
    }
  }

  $('html').on('keydown', temp_1);
  $('html').on('keydown', temp_2);

  $('.main-enroll .head input').one('blur', () => {
    $('html').off('keydown', temp_1);
    $('html').off('keydown', temp_2);
  });
});

/* 分页 */
/* @author: 陈泳充 */

$('.main-enroll .pages .page').on('mouseenter', 'li', function () {
  if ((page === 1 && $(this).html() === '') ||
    (page === pageNum && $(this).html() === '') ||
    $(this).html() === '...') {
    return;
  }
  if ($(this).attr('class') !== 'current') {
    $(this).addClass('mouse-enter');
  }
  $('.main-enroll .pages .page').one('mouseout', 'li', function () {
    $(this).removeClass('mouse-enter');
  });
});

$('.main-enroll .pages .page').on('click', 'li', function () {
  if ((page === 1 && $(this).html() === '') ||
    (page === pageNum && $(this).html() === '') ||
    $(this).html() == page ||
    $(this).html() === '...') {
    return;
  }

  if ($(this).html() === '') {
    page -= 1;
    page = page < 1 ? 1 : page;
  } else if ($(this).html() === '') {
    page += 1;
    page = page > pageNum ? pageNum : page;
  } else {
    page = $(this).html();
  }

  setStudentsMes(page, searchType, sInputValue, group, sStatus);
});

/* 修改状态 */
/* @author: 陈泳充 */
$('.main-enroll .head .change').on('click', () => {
  $('.change-status').fadeIn(100);
  const len = checkArr.length;
  if (!len) {
    $('.change-status').html(`
    <div class="error-mes">
      请至少选择一个学生
    </div> `);
    setTimeout(() => {
      $('.change-status').fadeOut(100);
    }, 1000);
  } else {
    $('.change-status').html(`
    <div class="content">
      <ul>
        <li>未笔试</li>
        <li>笔试通过</li>
        <li>面试通过</li>
        <li>考核通过</li>
        <li>考核失败</li>
      </ul>
      <div class="cancel">取消</div>
    </div>`);

    $('.change-status .content .cancel').one('click', () => {
      $('.change-status').fadeOut(100);
    });

    $('.change-status .content ul').one('click', 'li', function () {
      const statusArr = {
        未笔试: 0,
        笔试通过: 1,
        面试通过: 3,
        考核通过: 4,
        考核失败: 5,
      };
      const value = $(this).html();
      const status = statusArr[value];
      let names = '<ul style="margin:10px 0;list-style:disc">';
      $('.change-status').html(`
      <div class="is-change">
        <span></span>
        <div>
          <div class="is-change-yes">确认</div>
          <div class="is-change-no">取消</div>
        </div>
      </div>`);
      for (let i = 0; i < len; i++) {
        names += `<li>${studentsDetails[checkArr[i]].name}</li>`;
      }
      names += '</ul>';
      $('.change-status .is-change span').html(`确认把${names}的状态修改为"${value}" 吗？`);
      $('.change-status .is-change .is-change-no').one('click', () => {
        $('.change-status').fadeOut(100);
      });
      $('.change-status .is-change .is-change-yes').one('click', () => {
        const updateStatusBos = [];
        for (let i = 0; i < len; i++) {
          updateStatusBos.push({
            userId: studentsDetails[checkArr[i]].id,
            status,
          });
        }

        $.ajax({
          url: '/api/admin/updateStudentStatus',
          type: 'POST',
          dateType: 'json',
          headers: {
            'Content-Type': 'application/json',
            Authorization: $.cookie('token'),
          },
          data: JSON.stringify({
            updateStatusBos,
          }),
          async success() {
            await setStudentsMes(1, searchType, sInputValue, group, sStatus);
            $('.change-status').fadeOut(100);
          },
          error() {
            alert('修改失败');
          },
        });
      });
    });
  }
});
/**
 * @author 思贤
 * @function 清空信息
 * @params
 */
function clearStudentMes() {
  $('tbody').empty();
  $('.filter').show();
}

export {
  setStudentsMes,
  clearStudentMes
}