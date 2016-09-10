$(document).ready(function(){

  // Configure underscore
  _.templateSettings = {
    interpolate: /\{\{=(.+?)\}\}/g,
    evaluate: /\{\{(.+?)\}\}/g,
  };



});

function display_applications(data){

  console.log(data.application_instances);

  $(data.application_instances).each(function(i, app){
    var output_application = _.template(document.getElementById("template-applications").innerHTML);
    var output_new_relic = _.template(document.getElementById("template-new-relic").innerHTML);

    $('#applications').append(output_application(app));
    $('#applications #new-relic-' + app.host).append(output_new_relic(app.application_summary));

  });

  generate_ga_report('62035048');

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
  document.getElementById('query-output').value = formattedJson;
}

function gaLoadedProperly(){
  console.log('GA loaded properly');

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