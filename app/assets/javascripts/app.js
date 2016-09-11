$(document).ready(function(){

  // Configure underscore
  _.templateSettings = {
    interpolate: /\{\{=(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g,
  };

  perform_apps_query();

  window.setInterval(function(){
    perform_apps_query(); 
  }, 10000);

});

function display_applications(data){

  $('#applications').fadeOut(500).html('');

  var apps_processed = new Array();

  $(data.application_instances).each(function(i, app){
    if(app.application_summary != null && app.application_summary.apdex_score != null){

      app.apdex_score = app.application_summary.apdex_score;
      app.response_time = app.application_summary.response_time;
      app.error_rate = parseFloat(app.application_summary.error_rate, 2);
      app.throughput = app.application_summary.throughput;
      
      app.status = calculate_status(app);
      app.result = calculate_result(app);

      apps_processed.push(app);
    }
  });

  apps_processed.sort(function(a, b) {
    var nameA = a.status.toUpperCase(); // ignore upper and lowercase
    var nameB = b.status.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  });

  $(apps_processed).each(function(i, app){
    var output_application = _.template(document.getElementById("template-applications").innerHTML);
    $('#applications').append(output_application(app));

    var g = new JustGage({
      id: "gauge-" + app.host,
      value: app.result,
      min: 0,
      max: 100,
      width: 200,
      height: 90,
      titleFontColor: "#ffffff",
      valueFontColor: "#ffffff",
      levelColors:["#C9302C","#F39C12","#27AE60"],
      title: ""
    });
  });

  $('#applications').fadeIn(500);
}

function calculate_status(app){
  //class => warn / ok / error
  var status = "a_ok";

  if(app.apdex_score < 0.5 || app.error_rate > 0 || app.throughput == 0){
    status = "a_error";
  } else if (app.apdex_score < 0.7){
    status = "b_warn";
  } else {
    status = "c_ok";
  }
  return status;
}


function calculate_result(app){
  
  var result = app.apdex_score * 100;

  return result;
}

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function perform_apps_query(){

  console.log('Searching for apps');

  $.ajax({
      url: "https://api.newrelic.com/v2/applications/21403011/instances.json",
      data: {  },
      type: "GET",
      beforeSend: function(xhr){xhr.setRequestHeader('X-Api-Key', '953f38e2e64793277662e377ccc57da7a2c819b32768d95');},
      success: function(data) { 
        display_applications(data);
      }
    });
}