let groupId = getOnce();    

$('[groups]').on('click',function() {   //点击分页切换面试队伍查看
  groupId = $(this).attr("groups");
  localStorage.setItem("lastnum",groupId);
  cleanQueue();
  getQueue(groupId);
  $('.show-groups').text(groupSwitch(groupId));
  $('.groupname').text(groupSwitch(groupId));

  getInterviewTime()
})

/* 转换 */
/* @author: 黄创境 */
function sexSwitch(num) {
  if(num == 1) {
    return '男';
  } else if (num == 0) {
    return '女';
  } else {
    return 'err';
  }
}

function groupSwitch(num) {
  let grouparr = ['前端','后台','安卓','IOS','机器学习']
  return grouparr[num-1];
}

/* 检测 */
/* @author: 黄创境 */
$('#input-1').on('blur',function() {    //检测最大人数
  if($(this).val() <= 0) {
    $(this).next().find("span").text('数字小了喂');
    $(this).next().css('color','red');
  }
})

$('#input-2').on('focus',function() {   //获取当前时间
  $(this).val(getNowFormatDate());
})

function getNowFormatDate() {     //获取当前日期
  let date = new Date();
  let seperator1 = "-";
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
      month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
  }
 
  return year + seperator1 + month + seperator1 + strDate;
}

$('#input-2').on('blur',function() {   //检测日期
  let goday = $(this).val();
  let today = getNowFormatDate();

  if(new Date(goday.replace(/\-/g, "\/")) < new Date(today.replace(/\-/g, "\/"))) {
    $(this).next().find("span").text('过期了喂');
    $(this).next().css('color','red');
  }
})

$('#input-4').on('blur',function() {    //检测时间
  let startTime = $('#input-3').val().replace('-','');
  let endTime = $('#input-4').val().replace('-','');
  if(startTime >= endTime) {
    $(this).next().find("span").text('时间没错吗');
    $(this).next().css('color','red');
  }
})

$('.input-base').on('focus',function() {    //聚焦恢复
  let sayarr = ['最大面试人数','选择日期','开始时间','结束时间'] 
  $(this).next().css('color','#6a7989');
  $(this).next().find("span").text(sayarr[$(this).attr('inputid')]);
})

/* 查看面试队伍 */
/* @author: 黄创境 */
//读取历史
function getOnce() {
  let lastnum = localStorage.getItem("lastnum");

  if (lastnum !== null) {
      return lastnum;
  } else {
      return 1;
  }
}

function getQueue(id) {   //获取面试队伍请求
  $.ajax({    
    url : "/api/admin/getQueueStatus?groupId=" + id,   
    type : "GET", 
    headers : {
      'Authorization': $.cookie('token')
    },
    success : function(res) { 
      if(res.data.isQueueTime) {
        $('.interview-left .nonetime').css('display','none');
        addQueue(res.data);
      } else {
        $('.interview-left .nonetime').css('display','block');
      }
      
    },
    error : function(res) {  console.error(res)  }
  });   

}

function cleanQueue() {   //清空面试队列
  $('.witer table tbody').html("");
}

function addQueue(data) {   //添加面试队列
  let addQueueStr = "";
  $.each(data.queue, function(i, n) {
    addQueueStr +=  `
      <tr>
        <th>${n.sequenceNumber}</th>
        <th>${n.studentName}</th>
        <th>${sexSwitch(n.sex)}</th>
        <th studentid="${n.studentId}" title="点击标记已面试" ><a href="javascrip:void(0)">未面试</a></th>
        <th>${n.studentNumber}</th>
        <th>${n.phone}</th>
        <th>${n.college}</th>
      </tr>
    `;
  })
  $('.witer table tbody').html(addQueueStr);

  $('[studentid]').click(function() {   //点击完成面试
    finishInterview();
  });
}

//刷新按钮
$('.interview-top .icon-box').click(function () {
  $(`[groups=${groupId}]`).trigger("click"); 
})

/* 面试发布与动画 */
/* @author: 黄创境 */
$('.output-interview').mouseover(function () {    //鼠标移入动画
  $('.input-base').stop().animate({
    bottom:-50,
    opacity: 0.5,
  },300);
  $('.input-base').blur();
});

$('.output-interview').mouseout(function () {   //鼠标移出动画
  $('.input-base').stop().animate({
    bottom:0,
    opacity: 0,
  },300);
});

$('.output-interview').click(function() {   //点击确认发布面试
  let inputValueArr = [];-
  $('.input-base').each(function() {    //遍历检测
    if($(this).val() == "") {
      $(this).next().find("span").text('还没填呢');
      $(this).next().css('color','red');
    } else {
      inputValueArr.push($(this).val());
    }
  })

  if(inputValueArr.length == 4) {
    postQueue(inputValueArr,groupId);   //检验成功则发出发布面试请求
    $('.input-base').each(function() {  //清空input
      $(this).val("");
    });
  }
})

function postQueue(arr,id) {    //面试发布请求
  $.ajax({    
    url : "/api/admin/addQueue",   
    type : "POST", 
    contentType: "application/json",
    headers : {
      'Authorization': $.cookie('token')
    },
    data : JSON.stringify({
      groupId: id,
      maxStudentCount: arr[0],
      startTime: arr[1] + 'T' + arr[2] + ':00',
      endTime: arr[1] + 'T' + arr[3] + ':00',
    }),
    success : function(res) { 
      if(res.code == 200) {
        $(`[groups=${groupId}]`).trigger("click"); 
      }
    },
    error : function(data) {  console.error(data)  }    
  });   
}

/*已完成 */
/* @author: 黄创境 */
function finishInterview() {
  $.ajax({    
    url : "/api/admin/markStudentAsInterviewed?studentId=" + $(this).attr('studentid'),   
    type : "GET", 
    headers : {
      'Authorization': $.cookie('token')
    },
    success : function(res) { 
      console.log(res);
      cleanQueue();
      getQueue(groupId);
    },
    error : function(res) {  console.error(res)  }
  }); 
}

/*查看面试时间 */
/* @author: 黄创境 */
function getInterviewTime() {   //查看面试时间请求

  $('.page-time').html('');

  $.ajax({    
    url : "/api/admin/getAllNotEndInterviewTimesByAdmin?groupId=" + groupId,   
    type : "GET", 
    headers : {
      'Authorization': $.cookie('token')
    },
    success : function(res) {
      if(res.data == "") {
        $('.page-time').html('');
        $('.page-time').append(`<li class="page-time-item" style="display:block;">还没发布呢</li>`);
      } else {
        addTimeRanks(res.data);
      }
    },
    error : function(res) {  console.error(res)  }
  }); 
}

function addTimeRanks(data) {   //添加已面试时间 
  $('.page-time').html('');

  let addTimeRanksStr = "";
  $.each(data, function(i, n) {
    addTimeRanksStr += `
      <li class="page-time-item"> 
        <span class="time-first" title="日期" >${n.startTime.slice(8,10)}</span>
        <span title="时间">${n.startTime.slice(11,16)}-${n.endTime.slice(11,16)}</span>
        <span class="time-last" title="已面试人数" >${n.studentCount}/${n.maxStudentCount}</span>
      </li>
      <li class='time-delete' timeid=${n.id}> 
        <p>删除</p>
      </li>
    `;
  })

  $('.page-time').html(addTimeRanksStr);

  $('.page-time-item').on("click", function(){    //点击显示删除按钮

    if( $(this).next().css('display') == 'block' ) {
      $(this).next().css('display','none');
    } else {
      $.each($('.page-time-item'),function() {
        $(this).next().css('display','none');
      })
      $(this).next().css('display','block');
    }
    
  })

  $('.time-delete').on("click", function(){   //监听删除事件
    deleteInterviewTime($(this).attr('timeid'));
  })

}

/*删除面试时间 */
/* @author: 黄创境 */
function deleteInterviewTime(id) {
  $.ajax({    
    url : "/api/admin/deleteInterviewTime?interviewTimeId=" + id,   
    type : "GET", 
    headers : {
      'Authorization': $.cookie('token')
    },
    success : function(res) {
      console.log(res);
      $(`[groups=${groupId}]`).trigger("click"); 
    },
    error : function(res) {  console.error(res)  }
  }); 
}
 
