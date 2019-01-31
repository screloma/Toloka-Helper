var projectId = null;
var taskName = null;
var speedrun;

  chrome.storage.local.get('speedrun', function(item){
    if(Object.keys(item).length === 0){
      chrome.storage.local.set({'speedrun': true}, item =>{})
    }
    else{
      speedrun = item.speedrun;
    }
  })
  chrome.storage.onChanged.addListener(function(changes, areaName){
    if(typeof(changes.speedrun) !== "undefined"){
      speedrun = changes.speedrun;
    }
  })

  var updateSkill = function (projectId) {
    if (!projectId) return false;

    $.getJSON(tolokaHelperDB.urls.skills, function (data) {
      data = data.content;
      var skill = null;

      for (var i = 0; i < data.length; i++) {
        if (data[i].skillName === tolokaHelperDB.skills[projectId][2]) {
          skill = data[i].value.toString() + ' (' + data[i].oldValue.toString() + ')';
          console.log(skill);
          break;
        }
      } // for

      if (skill) {
        var skillH4 = $('h4.skill');
        var skillSep = $('h4.skill-sep');

        if (0 === skillH4.length) {
          skillSep = $('<h4 class="task__head__name skill-sep">-</h4>)').insertAfter('h4.task__head__name');
          skillH4 = $('<h4 class="task__head__name skill"></h4>').insertAfter(skillSep);
        }

        skillSep.css('display', 'inline');
        skillH4.html(skill);

      } else {
        document.remove('h4.skill-sep');
        document.remove('h4.skill');
      } // if (skill)
    }); // $.getJSON(tolokaHelperDB.urls.skills ...
  } // var updateSkill =


  window.addEventListener('message', function (event) {
    var data = event.data;
    if (data.tolokaHelperEvent && tolokaHelperDB.events.ready === data.eventType) {
        chrome.storage.sync.set({'filled': 0, "start": 0}, function(items) {});
        console.log(document.querySelector('.countdown__value'));
        $(".countdown__value").on('DOMSubtreeModified', function(event) {
          if((this.innerHTML === "1:39:20" || this.innerHTML === '59:20') && speedrun == true){
            chrome.storage.sync.set({'start': 1}, function(items) {
                          chrome.storage.onChanged.addListener(function(changes, areaName){
                if(typeof(changes.filled)!== "undefined"){
                  if(changes.filled.newValue === 1){
                    $('.task__submit').click();
                    console.log('Submitting...');
                    chrome.storage.sync.set({"filled": 0}, function(data){});
                }
                }
              })
            });
          }
      });

      taskName = $('h4.task__head__name').html();
      if (taskName) {
        for (var id in tolokaHelperDB.skills) {
          if (taskName === tolokaHelperDB.skills[id][0]) {
            projectId = id;
            break;
          }
        }
      }
      updateSkill(projectId);

      $('iframe[src="' + tolokaHelperDB.urls.iframe + '"]')[0].contentWindow.postMessage(
        {tolokaHelperEvent: true, eventType: tolokaHelperDB.events.updateFrame, projectId: projectId},
        tolokaHelperDB.urls.iframe
      );
    }
  }); // window.addEventListener('message' ...