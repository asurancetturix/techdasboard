$(document).ready(function(){

  // Configure underscore
  _.templateSettings = {
    interpolate: /\{\{=(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g,
  };

  $.ajax({
    url: "https://api.newrelic.com/v2/applications/21403011/instances.json",
    data: {  },
    type: "GET",
    beforeSend: function(xhr){xhr.setRequestHeader('X-Api-Key', '953f38e2e64793277662e377ccc57da7a2c819b32768d95');},
    success: function(data) { 
      display_new_relic(data);
    }
  });

});

function display_new_relic(data){
  $(data.application_instances).each(function(i, app){
    var output_new_relic = _.template(document.getElementById("template-applications").innerHTML);

    $('#applications').append(output_new_relic(app));

  });
  console.log(data.application_instances);
}