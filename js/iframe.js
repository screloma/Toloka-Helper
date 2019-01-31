var tasks = null;
var taskDivSelector = 'div.task-suite > div.task';
var realWindow = window.parent || window;
var filled = 0;

$(document).on('keydown', function(event){
  var data1 = event;
  if (data1.key === "e"){
    let i = $('.task').index($(taskDivSelector+'.task_focused'));
    $(taskDivSelector)[i+1].scrollIntoView();
    $(taskDivSelector)[i+1].click();
  }
  if (data1.key === "q"){
  let i = $('.task').index($(taskDivSelector+'.task_focused'));
  $(taskDivSelector)[i-1].scrollIntoView(true);
  $(taskDivSelector)[i-1].click();
  }
})


window.addEventListener('message', function(event){
  var data1 = event.data;
  if (data1.eventType === "hotkey:key" && data1.data === "E"){
    let i = $('.task').index($(taskDivSelector+'.task_focused'));
    console.log(i);
    $(taskDivSelector)[i+1].scrollIntoView(true);
    $(taskDivSelector)[i+1].click();
  }
  if (data1.eventType === "hotkey:key" && data1.data === "Q"){
  let i = $('.task').index($(taskDivSelector+'.task_focused'));
  $(taskDivSelector)[i-1].scrollIntoView(true);
  $(taskDivSelector)[i-1].click();
  }
})


window.addEventListener('message', function (event) {
    chrome.storage.onChanged.addListener(function(changes, areaName){
    if(typeof(changes.start) !== "undefined"){
      if(changes.start.newValue === 1){
        console.log('Starting');
        if($('.radio-wrapper').has('.radio_checked').length === 11){
            filled = 1;
            chrome.storage.sync.set({"filled": 1, 'start': 0}, function(data){console.log('Filled!');});
        }
        else{
            console.log('Not filled.');
          }
      }
    }
  })
  var data = event.data;
  if (data.tolokaEvent && ('assignment:start' === data.eventType || 'assignment:resume' === data.eventType )) {
    window.parent.postMessage(
      {tolokaHelperEvent: true, eventType: tolokaHelperDB.events.ready, poolId: data.poolId},
      tolokaHelperDB.urls.top
    );
    tasks = data.data.tasks;
  } else if (data.tolokaHelperEvent && tolokaHelperDB.events.updateFrame === data.eventType) {
    switch (data.projectId) {
      case '346':
        $(taskDivSelector).each(function (i) {
          var img = new Image();
          img.src = $(this).find('div.img__container > img')[0].src;

          img.onload = function () {
            var parentDiv = $(taskDivSelector)
              .find('div.img__container > img[src="' + img.src + '"]')
              .siblings('div.img__container__imitation');

            parentDiv.height(img.naturalHeight * parentDiv.width() / img.naturalWidth);
          }

          for (var j = 0; j < tolokaHelperDB.grad5.length; j++) {
            if (
              tasks[i].input_values.query === tolokaHelperDB.grad5[j][0]
              && (!tolokaHelperDB.grad5[j][1] || tasks[i].input_values.region_name === tolokaHelperDB.grad5[j][1])
              && tasks[i].input_values.url === tolokaHelperDB.grad5[j][2]
            ) {
              $(this)
                .addClass('highlighted')
                .find('input[type="radio"][name="relevance"][value="' + tolokaHelperDB.grad5[j][3] + '"]')
                .click()
                .addClass('highlighted');
              break;
            }
          }
        });
        break;

      case '1945':
        $(taskDivSelector).find('input[type="checkbox"][name="boring"]').click();
        break;
    } // switch
    
    $('div.task-suite').css('overflow', 'initial');
    $(taskDivSelector).first().click()[0].scrollIntoView();
  }
});
