$(document).ready(function(){

  // Configure underscore
  _.templateSettings = {
    interpolate: /\{\{=(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g,
  };

});

function display_applications(data){

  $('#applications').fadeOut(500).html('');

  var apps_processed = new Array();

  $(data.application_instances).each(function(i, app){
    if(app.application_summary != null && app.application_summary.apdex_score != null){
      app.analytics = calculate_analytics(app);
      app.bounce_rate = parseFloat(getRandomArbitrary(0,50)).toFixed(2);
      app.daily_users = Math.round(getRandomArbitrary(0,15000));
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

  //generate_ga_report('62035048');
}

function calculate_status(app){
  //class => warn / ok / error
  var ap_dex = app.application_summary.apdex_score;
  var response_time = app.application_summary.response_time;

  var status = "a_ok";

  if(ap_dex < 0.5){
    status = "a_error";
  } else if (ap_dex < 0.7){
    status = "b_warn";
  } else {
    status = "c_ok";
  }

  return status;

}


function calculate_result(app){
  
  var result = getRandomArbitrary(0,100);

  return result;
}

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function calculate_analytics(app){
  var view_id = "62035048";

  switch(app.host){
    case "USMIWEBS010":
      view_id = "62035048";
    break;

    case "IWHCWEB001":
      view_id = "2013095";
    break;

    case "USMIWEBS013":
      view_id = "62035048";
    break;

    case "USPAWEBS005":
      view_id = "2013095";
    break;

  }

  return view_id;
}

// Replace with your view ID.
function generate_ga_report(view_id){
  var report = {
    viewId: view_id,
    dateRanges: [
      {
        startDate: 'today',
        endDate: 'today'
      }
    ],
    metrics: [
      {
        expression: 'ga:sessions'
      },
      {
        expression: 'ga:bounceRate'
      }
    ]
  }

  gapi.client.request({
    path: '/v4/reports:batchGet',
    root: 'https://analyticsreporting.googleapis.com/',
    method: 'POST',
    body: {
      reportRequests: [
        report
      ]
    }
  }).then(display_ga_results, console.error.bind(console));

}

function display_ga_results(response) {
  var formattedJson = JSON.stringify(response.result, null, 2);

  var totals = response.result.reports[0].data.totals[0].values;

  var sessions = totals[0];
  var bounce_rate = totals[1];

  $('.day-sessions').html(sessions);
  $('.bounce-rate').html(parseFloat(bounce_rate).toFixed(2));
}

function gaLoadedProperly(){

  perform_apps_query();

  window.setInterval(function(){
    perform_apps_query(); 
  }, 15000);

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