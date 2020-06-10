/* ---------------------------------------------- */
/*         CREATING VARIABLES/CONSTANTS           */
/* ---------------------------------------------- */
// SELECT HTML ELEMENTS
const country_name_element= document.querySelector(".country .name");
const total_cases_element= document.querySelector(".total-cases .value");
const new_cases_element= document.querySelector(".total-cases .new-value");
const actual_rate_element= document.querySelector(".total-cases .rate-value");
const recovered_element= document.querySelector(".recovered .value");
const new_recovered_element= document.querySelector(".recovered .new-value");
const recovered_rate_element= document.querySelector(".recovered .rate-value");
const deaths_element= document.querySelector(".deaths .value");
const new_deaths_element= document.querySelector(".deaths .new-value");
const death_rate_element= document.querySelector(".deaths .rate-value");
const update_date_element= document.querySelector(".update-date");

const ctx1= document.getElementById("chart_1").getContext("2d");
const ctx2= document.getElementById("chart_2").getContext("2d");
const ctx3 = document.getElementById("chart_3").getContext('2d');
const ctx4 = document.getElementById("chart_4").getContext('2d');

// CREATING NEW APP VARIABLES
let cases_list= [],     //total cases or confirmed cases
    recovered_list=[],
    deaths_list=[],
    actual_cases_list= [],
    predicted_cases_list= [],
    recovery_deaths_list= [],
    actual_rate_list= [],
    recovery_death_rate_list= [],
    dates= [],
    formatted_dates= [],
    dates_for_predicted= [],
    formatted_predicted_dates= [],
    country_log= [],    //for graph 2
    country_rate= [],   //for graph 2
    country_list_from_sheet= [],     //for graph 2
    countries2d= [];        //for making google geomaps

let app_data;       //stores results fetched from google sheets API
let global_country_name;
var starti,endi,endi_for_predicted,i,create_map=1;     //create_map notes if app is running for the first time and thus map has to be made

// GET USERS COUNTRY CODE ACCORDING TO IP ADDRESS
// let country_code= geoplugin_countryCode();
// country_list.forEach (country => {
//   if(country.code == country_code){
//     global_country_name= country.name;
//   }
// });
global_country_name="India";

/* ------------------------------------------------------------------- */
/*    FETCHING DATA FROM GOOGLE SHEETS AND CALCULATING LIST VALUES     */
/* ------------------------------------------------------------------- */

function fetchData(user_country){
  country_name_element.innerHTML = "Loading...";

  //Global_country_name is a global variable whose value is fetched from geolocation using their IP address
  //User_country is a local variable whose value is equal to the value sent as parameter by the calling function(from the change button or selecting from map)
  if (user_country){
    country_name_element.innerHTML =user_country;
    global_country_name= user_country;
  }
  else if (global_country_name){
    country_name_element.innerHTML= global_country_name;
    user_country= global_country_name;
  }

  //Making all arrays empty so that new countriy's data can be stored instead of pushing into the old country's array
  cases_list=[], recovered_list=[], deaths_list=[],actual_cases_list= [],predicted_cases_list= [],recovery_deaths_list= [],actual_rate_list= [],recovery_death_rate_list= [],dates= [],formatted_dates=[],dates_for_predicted= [],formatted_predicted_dates= [], countries2d= [];

  new_cases_element.innerHTML = '+';
  new_recovered_element.innerHTML = '+';
  new_deaths_element.innerHTML = '+';
  update_date_element.innerHTML = 'Last updated on : ';

  //Using AJAX to make an asynchronous HTTP GET request
  const Http = new XMLHttpRequest();
  const url='https://sheets.googleapis.com/v4/spreadsheets/1tM6zsYBhClbntPJIzkPNhBNEs-4tbVMEyd83zm3mAcM/values/Sheet1?key=AIzaSyDq2RHtMJTUbpgKgmkegATfzQvpKPun1OA';
  Http.open("GET", url);
  Http.send();

  Http.onreadystatechange = function() {
  if(this.readyState==4 && this.status==200){
    const res= Http.responseText;
    const result= JSON.parse(res);

    //Sending the retrieved data to myData function to build a 2D array for making map
    if(create_map==1)
      mapData(result);

    //Finding index in Excel sheet from where given country's data begins
    for (starti = 1; starti < result.values.length; starti++) {
      if (result.values[starti][0]== user_country)
        break;
    }

    //Finding index in Excel sheet from where given country's data ends
    var values_finished=0;        //this variable notes if the country contains any predicted cases data or not
    for (endi = starti; endi < result.values.length; endi++) {
      if (result.values[endi][0]!= user_country)
        break;
      else if (result.values[endi][2].length==0){   //confirmed cases data[endi][2] is finished but country name data is present in that row this means there are values in predicted cases column
        values_finished=1;
        break;
      }
    }
    if (values_finished==1){       //predicted cases data is present
      for (endi_for_predicted = endi; endi_for_predicted < result.values.length; endi_for_predicted++) {
        if (result.values[endi_for_predicted][0]!= user_country){
          break;
        }
      }
    }
    else{           //predicted cases data is not present
      endi_for_predicted=endi;
    }

    for (i = starti; i < endi; i++) {
      dates.push(result.values[i][1]);
      formatted_dates.push(formatDate(result.values[i][1]));
    }
    for (i = starti; i < endi_for_predicted; i++) {
      dates_for_predicted.push(result.values[i][1]);
      formatted_predicted_dates.push(formatDate(result.values[i][1]));
    }
    for (i = starti; i < endi; i++) {
      cases_list.push(parseInt(result.values[i][2]));
    }
    for (i = starti; i < endi; i++) {
      recovered_list.push(parseInt(result.values[i][3]));
    }
    for (i = starti; i <= endi; i++) {
      deaths_list.push(parseInt(result.values[i][4]));
    }
    for (i = starti; i <= endi; i++) {
      actual_cases_list.push(parseInt(result.values[i][6]));
    }
    for (i = starti; i < endi_for_predicted; i++) {
      predicted_cases_list.push(parseInt(result.values[i][5]));
    }
    for (i = starti; i <= endi; i++) {
      recovery_deaths_list.push(parseInt(result.values[i][20]));
    }
    for (i = starti; i <= endi; i++) {
      actual_rate_list.push(parseFloat(result.values[i][16]));
    }
    for (i = starti; i <= endi; i++) {
      recovery_death_rate_list.push(parseFloat(result.values[i][19]));
    }

    app_data= result.values;     //we need to ignore the first row while using app_data as it contains the field names also
    updateUI();
    }
  }
}

fetchData(global_country_name);

//UPDATE UI FUNCTION
function updateUI(){
  updateStats();
  chart1();
  chart2_calc();
  chart3();
  chart4();
}

/* ---------------------------------------------- */
/*                      MAP                       */
/* ---------------------------------------------- */
//MapData function creates a 2D array with country names and their cases. This array is used to build the world map
function mapData(result){
  create_map=0;     //we only have to make map when app is running for the first time
  var flag=0;       //flag stores if a country contains predicted cases data or not. Loop will break when flag=1
  countries2d.push(['Country', 'Confirmed Cases']);
  for(i=1; i<result.values.length-1;++i){
    if(result.values[i][0]!= result.values[i+1][0] && flag==0)   //for countries with no predicted dataset. First condition checks if a country's data is finished and flag checks if a country contains predicted dataset
      countries2d.push([result.values[i][0], parseInt(result.values[i][2])]);
    else if(!result.values[i+1][2] && result.values[i][0]== result.values[i+1][0] && flag==0){   //no confirmed cases[2] but country's data is not finsihed[0] this means predicted dataset is present
      flag=1;
      countries2d.push([result.values[i][0], parseInt(result.values[i][2])]);
    }
    else if(result.values[i][0]!= result.values[i+1][0])     //country changed
      flag=0;
  }
  createMap();
}


var flag=0;
function createMap(){
  console.log("triggered")
  google.charts.load('current', {
        'packages':['geochart'],
        'mapsApiKey': 'AIzaSyB2AdWGI5geyvPnxxTPKUv6rUvbrLuK8bE'
      });
      google.charts.setOnLoadCallback(drawRegionsMap);

      function drawRegionsMap() {
        var data = google.visualization.arrayToDataTable(countries2d);

        var options = {
          colorAxis: {colors: ['#fce9c4','#f8cb74','#f7c461','#f5b539','#dda333','#d5873f','#ac7f28','#941e40'], stroke: '#34c', strokeWidth: 130},
          backgroundColor: {fill:'transparent',stroke:'#fff' ,strokeWidth:0 },
          datalessRegionColor: '#F5F0E7',
          displayMode: 'regions',
          enableRegionInteractivity: 'true',
          resolution: 'countries',
          sizeAxis: {minValue: 1, maxValue:1,minSize:10,  maxSize: 10},
          region:'world',
          keepAspectRatio: true,
          tooltip: {isHtml:'true',textStyle: {color: '#444444'}, trigger:'focus'}};

        var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));


        //To update statistics when a region is clicked
        google.visualization.events.addListener(chart, "regionClick", function (eventData) {
          let countrycode= eventData.region;
          for (i=0;i<country_list.length;++i){
            if(country_list[i].code == eventData.region){
              flag=1;
              fetchData(country_list[i].name);
            }
          }
        })

        if(flag==0)
          chart.draw(data, options);
      }
}


/* ---------------------------------------------- */
/*              UPDATING INNER HTML                */
/* ---------------------------------------------- */
function updateStats(){
  let last_entry= app_data[endi-1];
  let before_last_entry= app_data[endi-2];

  country_name_element.innerHTML = last_entry[0];
  update_date_element.innerHTML += formatDate(last_entry[1]) +'-2020';

  total_cases_element.innerHTML = last_entry[2] || 0;
  new_cases_element.innerHTML += (last_entry[2] - before_last_entry[2]) || 0;
  actual_rate_element.innerHTML = last_entry[16] || 0;
  recovered_element.innerHTML = last_entry[3] || 0;
  new_recovered_element.innerHTML += (last_entry[3] - before_last_entry[3]) || 0;
  recovered_rate_element.innerHTML = last_entry[17] || 0;
  deaths_element.innerHTML = last_entry[4] || 0;
  new_deaths_element.innerHTML += (last_entry[4] - before_last_entry[4]) || 0;
  death_rate_element.innerHTML = last_entry[18] || 0;

  actual_rate_element.innerHTML += ' Active';
  recovered_rate_element.innerHTML += ' Recovery';
  death_rate_element.innerHTML += ' Deaths';
}


/* ---------------------------------------------- */
/*                    GRAPH 1                     */
/* ---------------------------------------------- */
let chart_1;
var peak_date;
function chart1(){
  //Finding Peak Date of active cases
  var max=0;
  if(predicted_cases_list[0]!=0){
    for(i=0;i<predicted_cases_list.length;i++){
      if(predicted_cases_list[i]>predicted_cases_list[max])
        max=i;
    }
    peak_date= formatted_predicted_dates[max];
  }
else{
  for(i=0;i<actual_cases_list.length;i++){
    if(actual_cases_list[i]>actual_cases_list[max])
      max=i;
  }
  peak_date= formatted_dates[max];
}

  if(chart_1){
    chart_1.destroy();
  }

  chart_1 = new Chart(ctx1, {
    type: 'bar',
    data: {
        datasets: [{
            label: 'Active Cases',
            data: actual_cases_list,
            fill: false,
            borderColor: '##ff6b71',
            backgroundColor: '#ff6b71',
            borderWidth: 2
        },{
            label: 'Predicted Cases',
            data: predicted_cases_list,


            // Changes this dataset to become a line
            type: 'line',
            fill: false,
            borderColor: '#4c6585',
            backgroundColor: '#4c6585',
            borderWidth: 1.5,
            pointRadius: 0.5
        }],
        labels: formatted_predicted_dates
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: 'Peak Date : '+ peak_date
      },
      scales: {
        xAxes: [{
          gridLines: {display:false},
          scaleLabel: {display: true, labelString: 'Dates'}
        }],
        yAxes: [{
          gridLines: {display:false},
          scaleLabel: {display: true, labelString: 'Number of Cases'}
        }]
      }
    }
  });
}


/* ---------------------------------------------- */
/*                    GRAPH 2                     */
/* ---------------------------------------------- */
let series = [], pointBackgroundColor = [], vertical_line_data=[];

function chart2_calc(){
  country_log= [], country_rate= [], country_list_from_sheet= [], series=[], pointBackgroundColor=[], vertical_line_data=[];
  var max_country_rate=0;
  //Using AJAX to make an asynchronous HTTP GET request
  const Http = new XMLHttpRequest();
  const url='https://sheets.googleapis.com/v4/spreadsheets/1LvNBASr46zst9kTMi5cAQR7tQZXBV1YiJZruDNH4J_8/values/Sheet1?key=AIzaSyB2AdWGI5geyvPnxxTPKUv6rUvbrLuK8bE';
  Http.open("GET", url);
  Http.send();

  Http.onreadystatechange = function() {
    if(this.readyState==4 && this.status==200){
      const res= Http.responseText;
      const result= JSON.parse(res);

      var i;
      for (i = 1; i < result.values.length; i++) {
        country_log.push(parseFloat(result.values[i][2]));
      }
      for (i = 1; i < result.values.length; i++) {
        country_rate.push(parseFloat(result.values[i][1]));
        if(parseFloat(result.values[i][1])>max_country_rate)
          max_country_rate= parseFloat(result.values[i][1]);
      }
      for (i = 1; i < result.values.length; i++) {
        country_list_from_sheet.push(result.values[i][0]);
      }
      for (i = 1; i < result.values.length; i++) {
        series.push(parseFloat(result.values[i][2]));
      }
      for (i = 1; i < result.values.length; i++) {
        if(parseFloat(result.values[i][2])== 6.00)
          vertical_line_data.push(max_country_rate);
        else
          vertical_line_data.push(0);
      }

      series.forEach(
        (value, index) => {
          if (country_list_from_sheet[index] == global_country_name ||
              country_list_from_sheet[index]== "China"  ||
              country_list_from_sheet[index]== "Italy"  ||
              country_list_from_sheet[index]== "US"  ||
              country_list_from_sheet[index]== "India") {
            pointBackgroundColor.push('#f5b539');
          } else {
            pointBackgroundColor.push('transparent');
          }
          if (country_list_from_sheet[index] == global_country_name){
            pointBackgroundColor[index]= '#f4465d';
          }
        });

      chart2();
    }
  }
}



let chart_2;
function chart2(){

  if(chart_2){
    chart_2.destroy();
  }

  chart_2 = new Chart(ctx2, {
    type: 'bar',                //To draw the vertical line
    data: {
        datasets: [{
          label: 'Countries which overcame and countries yet to overcome Coronavirus pandemic',
          data: vertical_line_data,
          backgroundColor: '#ffaead',
          barThickness: 1.3
        },{
            label: '',
            data: country_rate,
            fill: false,
            backgroundColor: '#000000',
            pointBackgroundColor: pointBackgroundColor,
            pointRadius: 9,
            pointHoverRadius: 11,
            borderColor: 'transparent',
            type:'line'
        }],
        labels: country_log
    },
    options:{
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          gridLines: {display:false},
          scaleLabel: {display: true, labelString: 'Log Rate of Confirmed Cases'},
          ticks: {autoSkip: true, maxTicksLimit: 10}
        }],
        yAxes: [{
          gridLines: {display:false},
          scaleLabel: {display: true, labelString: 'Rate of Confirmed Cases'}
        }],
      },
      showAllTooltips: true,
      tooltips: {
        filter: function (tooltipItem, data) {    //this filter uses the chartjs plugin code written at the end to tap into tooltip indices to enable or disable them
          //Turning off tooltips for barchart
          if(data.datasets[tooltipItem.datasetIndex].data== vertical_line_data)
            return false;
          else if(data.datasets[tooltipItem.datasetIndex].data.length< country_list_from_sheet.length)
            return false;
          else
            return true;
        },
        callbacks: {
          label: function(tooltipItem, data) {
              if (country_list_from_sheet[tooltipItem.index]== global_country_name ||
                  country_list_from_sheet[tooltipItem.index]== "China"  ||
                  country_list_from_sheet[tooltipItem.index]== "Italy"  ||
                  country_list_from_sheet[tooltipItem.index]== "US"  ||
                  country_list_from_sheet[tooltipItem.index]== "India"){
                var label = country_list_from_sheet[tooltipItem.index];
              }
              return label;
          },
          title: function(tooltipItem, data) {
            return;
          }
        },
        backgroundColor: 'rgba(0,0,0,0)',
        bodyFontColor	: '#000',
        displayColors: false
      }
    }
});
}


/* ---------------------------------------------- */
/*                    GRAPH 3                     */
/* ---------------------------------------------- */
let chart_3;
function chart3(){

  if(chart_3){
    chart_3.destroy();
  }

  chart_3 = new Chart(ctx3, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Active Cases %',
            data: actual_rate_list,
            fill: false,
            borderColor: '#951f41',
            backgroundColor: '#951f41',
            borderWidth: 2.5,
            pointRadius: 0.1,
            pointHoverRadius: 3,
            pointHitRadius: 7
        },{
            label: 'Recovery + Death %',
            data: recovery_death_rate_list,
            fill: false,
            borderColor: '#f5b539',
            backgroundColor: '#f5b539',
            borderWidth: 2.5,
            pointRadius: 0.1,
            pointHoverRadius: 3,
            pointHitRadius: 7
        }],
        labels: formatted_dates
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          gridLines: {display:false},
          scaleLabel: {display: true, labelString: 'Dates'}
        }],
        yAxes: [{
          gridLines: {display:false},
          scaleLabel: {display: true, labelString: 'Percentage of Cases'}
        }]
      }
    }
});
}


/* ---------------------------------------------- */
/*                    GRAPH 4                     */
/* ---------------------------------------------- */
let chart_4;
function chart4(){

  if(chart_4){
    chart_4.destroy();
  }

  chart_4 = new Chart(ctx4, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Confirmed Cases',
            data: cases_list,
            fill: false,
            borderColor: '#951f41',
            backgroundColor: '#951f41',
            borderWidth: 2.5,
            pointRadius: 0.1,
            pointHoverRadius: 3,
            pointHitRadius: 7
        },{
            label: 'Recovery + Deaths',
            data: recovery_deaths_list,
            fill: false,
            borderColor: '#f5b539',
            backgroundColor: '#f5b539',
            borderWidth: 2.5,
            pointRadius: 0.1,
            pointHoverRadius: 3,
            pointHitRadius: 7
        }],
        labels: formatted_dates
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          gridLines: {display:false},
          scaleLabel: {display: true, labelString: 'Dates'}
        }],
        yAxes: [{
          gridLines: {display:false},
          scaleLabel: {display: true, labelString: 'Number of Cases'}
        }]
      }
    }
});
}


/* ---------------------------------------------- */
/*               CHANGE DATE FORMAT               */
/* ---------------------------------------------- */
const monthNames= ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function formatDate(dateString){
  // Converting Date format into format that can be parsed by the Date object
  var convertedDateArray=[], convertedDate, i;
  for (i=6;i<10;++i)
    convertedDateArray.push(dateString[i]);
  convertedDateArray.push('-');
  for (i=3;i<5;++i)
    convertedDateArray.push(dateString[i]);
  convertedDateArray.push('-');
  for (i=0;i<2;++i)
    convertedDateArray.push(dateString[i]);
  convertedDate= convertedDateArray.join("");

  let date= new Date(convertedDate);
  const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' })
  const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat .formatToParts(date )

  return `${day}-${month}`;
}


/* --------------------------------------------------------- */
/*    PLUGIN TO SHOW ALL TOOLTIPS IN CHART 2 AT ALL TIMES    */
/* --------------------------------------------------------- */
Chart.pluginService.register({
            beforeRender: function (chart) {
                if (chart.config.options.showAllTooltips) {
                    // create an array of tooltips
                    // we can't use the chart tooltip because there is only one tooltip per chart
                    chart.pluginTooltips = [];
                    chart.config.data.datasets.forEach(function (dataset, i) {
                        chart.getDatasetMeta(i).data.forEach(function (sector, j) {
                            chart.pluginTooltips.push(new Chart.Tooltip({
                                _chart: chart.chart,
                                _chartInstance: chart,
                                _data: chart.data,
                                _options: chart.options.tooltips,
                                _active: [sector]
                            }, chart));
                        });
                    });

                    // turn off normal tooltips
                    chart.options.tooltips.enabled = false;
                }
            },
            afterDraw: function (chart, easing) {
                if (chart.config.options.showAllTooltips) {
                    // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
                    if (!chart.allTooltipsOnce) {
                        if (easing !== 1)
                            return;
                        chart.allTooltipsOnce = true;
                    }

                    // turn on tooltips
                    chart.options.tooltips.enabled = true;
                    Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
                        tooltip.initialize();
                        tooltip.update();
                        // we don't actually need this since we are not animating tooltips
                        tooltip.pivot();
                        tooltip.transition(easing).draw();
                    });
                    chart.options.tooltips.enabled = true;
                }
            }
        })
