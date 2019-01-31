console.log('Starting');
function save_options(){
    var speed_on = $('#speedrun').prop('checked');
    console.log('speeeed')
}

function restore_options(){
    chrome.storage.local.get('speedrun', function(items){
        $('#speedrun').prop('checked', items.speedrun);
    })
        chrome.storage.local.get('interval', function(items){
        $('.fuck').value = items.interval;
    })

}

$('.save_button').on('click', function(e){
    console.log('clicked');
    chrome.storage.sync.set({'interval': $('.fuck')[0].value}, function(items) {});
    chrome.storage.sync.set({'speedrun': $('#speedrun').prop('checked')}, function(items) {});
})

$(document).ready(restore_options);