//================================================================================
//  @file         coDashboard1.js
//  @version      0.0.1
//  @path         client/_controllers/
//  @description  CONTROLLER para Dashboards.
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

if (Meteor.isClient) {

	updateChart2 = function(val){
		var val =  	Session.get('slider');
		var lineInfo = Session.get("MACHINEDATAOBJ");
		var anl1Array = [];
		var anl2Array = [];
		var formattedDateTime = [];

		//Pego os novos valores
		for(i = 0; i < lineInfo.datetimedata.length; i++){
			if((lineInfo.datetimedata[i] >= val[0]) && (lineInfo.datetimedata[i] <= val[1])){
				anl1Array.push(lineInfo.HardwareSignals.InAnls[1].InAnl1[i]);
				anl2Array.push(lineInfo.HardwareSignals.InAnls[2].InAnl2[i]);
				formattedDateTime.push(moment(lineInfo.datetimedata[i], 'X').format('DD/MM - HH:mm'));
			}
		}
		//Destruo o gráfico anterior
		trendingLineChart.destroy();
		//Passao a data
		var data = {
			labels : formattedDateTime,
			datasets : [
			{
			label: "temp",//machineObj.Profile.value[0],
			fillColor : "rgba(128, 222, 234, 0.0)",
			strokeColor : "#e53935",
			pointColor : "#e53935",
			pointStrokeColor : "#e53935",
			pointHighlightFill : "#9e9e9e",
			//pointHighlightStroke : "#ffffff",
			data: anl1Array,
			unit: "t"//machineObj.Profile.unit[0]
		},

		{
			label: "press",//machineObj.Profile.value[1],
			fillColor : "rgba(128, 222, 234, 0.0)",
			strokeColor : "#246BB2",
			pointColor : "#246BB2",
			pointStrokeColor : "#246BB2",
			pointHighlightFill : "#9e9e9e",
			//pointHighlightStroke : "#80cccc",
			data: anl2Array,
			unit: "p"//machineObj.Profile.unit[1]
		},
		]};

		//Re-inicio o gráfico
		var ctx = document.getElementById("trending-line-chart-info-modal").getContext("2d");
		trendingLineChart = new Chart(ctx).Line(data, {
		scaleShowGridLines : true,///Boolean - Whether grid lines are shown across the chart
		scaleGridLineColor : "rgba(255,255,255,0.4)",//String - Colour of the grid lines
		scaleGridLineWidth : 1,//Number - Width of the grid lines
		scaleShowHorizontalLines: true,//Boolean - Whether to show horizontal lines (except X axis)
		scaleShowVerticalLines: false,//Boolean - Whether to show vertical lines (except Y axis)
		bezierCurve : true,//Boolean - Whether the line is curved between points
		bezierCurveTension : 0.4,//Number - Tension of the bezier curve between points
		pointDot : true,//Boolean - Whether to show a dot for each point
		pointDotRadius : 5,//Number - Radius of each point dot in pixels
		pointDotStrokeWidth : 2,//Number - Pixel width of point dot stroke
		pointHitDetectionRadius : 20,//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
		datasetStroke : true,//Boolean - Whether to show a stroke for datasets
		datasetStrokeWidth : 3,//Number - Pixel width of dataset stroke
		datasetFill : true,//Boolean - Whether to fill the dataset with a colour
		animationSteps: 15,// Number - Number of animation steps
		animationEasing: "easeOutQuart",// String - Animation easing effect
		tooltipTitleFontFamily: "'Roboto','Helvetica Neue', 'Helvetica', 'Arial', sans-serif",// String - Tooltip title font declaration for the scale label
		scaleFontSize: 12,// Number - Scale label font size in pixels
		scaleFontStyle: "normal",// String - Scale label font weight style
		scaleFontColor: "#fff",// String - Scale label font colour
		tooltipEvents: ["mousemove", "touchstart", "touchmove"],// Array - Array of string names to attach tooltip events
		tooltipFillColor: "rgba(255,255,255,0.8)",// String - Tooltip background colour
		tooltipTitleFontFamily: "'Roboto','Helvetica Neue', 'Helvetica', 'Arial', sans-serif",// String - Tooltip title font declaration for the scale label
		tooltipFontSize: 12,// Number - Tooltip label font size in pixels
		tooltipFontColor: "#000",// String - Tooltip label font colour
		tooltipTitleFontFamily: "'Roboto','Helvetica Neue', 'Helvetica', 'Arial', sans-serif",// String - Tooltip title font declaration for the scale label
		tooltipTitleFontSize: 0,// Number - Tooltip title font size in pixels
		tooltipTitleFontStyle: "bold",// String - Tooltip title font weight style
		tooltipTitleFontColor: "#000",// String - Tooltip title font colour
		tooltipYPadding: 8,// Number - pixel width of padding around tooltip text
		tooltipXPadding: 16,// Number - pixel width of padding around tooltip text
		tooltipCaretSize: 10,// Number - Size of the caret on the tooltip
		tooltipCornerRadius: 6,// Number - Pixel radius of the tooltip border
		tooltipXOffset: 10,// Number - Pixel offset from point x to tooltip edge
		responsive: true,
		scaleShowLabels: true,
		multiTooltipTemplate: "<%= datasetLabel %> - <%= value %><%= datasetUnit %>"
	});

},


//********************************************************************************
// Helpers
//********************************************************************************

Template.infoDashboardModal.helpers({

	'slider': function () {
		var times = Session.get("slider");
		if(times != undefined){
			return [moment.utc(times[0], 'X').format('DD/MM/YY - HH:mm:ss'), moment.utc(times[1], 'X').format('DD/MM/YY - HH:mm:ss')];
		}else{
			times = Session.get("MACHINEDATAOBJ");
			if(times == undefined){
				return false;
			}else
			{
				var min = times.datetimedata[0];
				var max = times.datetimedata[times.datetimedata.length -1];
				return [moment.utc(max, 'X').format('DD/MM/YY - HH:mm:ss'), moment.utc(min, 'X').format('DD/MM/YY - HH:mm:ss')];
			}
		}
	},


	'sliderDatatable': function () {
		var times = Session.get("slider");
		if(times != undefined){
			return [moment.utc(times[0], 'X').format('DD/MM/YY - HH:mm:ss'), moment.utc(times[1], 'X').format('DD/MM/YY - HH:mm:ss')];
		}else{
			times = Session.get("MACHINEDATAOBJ");
			if(times == undefined){
				return false;
			}else
			{
				var min = times.datetimedata[0];
				var max = times.datetimedata[times.datetimedata.length -1];
				return [moment.utc(max, 'X').format('DD/MM/YY - HH:mm:ss'), moment.utc(min, 'X').format('DD/MM/YY - HH:mm:ss')];
			}
		}
	},

	/*pega os dados totais da MachineData para apresentar no log*/
	'getMachineDataModal': function(){
		var machineDataObj = MachineData.find({}, {sort: {datetimedata: -1 }});
		return machineDataObj;
	},

	'getMachineProfileModal' : function(){
		var thisMachine = Session.get('selectedMachine');
		var machineObj  = Machines.findOne(thisMachine);
		var valueArray  = machineObj.Profile.value;
		var unitArray   = machineObj.Profile.unit;
		var limitArray  = machineObj.Profile.limit;
		var resultArray = [];

		for(i = 0; i < valueArray.length; i++){
			resultArray[i] = [valueArray[i], unitArray[i], limitArray[i]];
		}

		return resultArray;
	},

	'formatDateDash': function(datetime){
		if(datetime == undefined){
			return "Data Inválida!";
		}else{
			var resultFormat = moment(datetime, 'X').format('DD/MM - HH:mm:ss');
			return resultFormat;
		}
	},

});

Template.dashboard1.helpers({

	'formatDateDash': function(datetime){
		if(datetime == undefined){
			return "Data Inválida!";
		}else{
			var resultFormat = moment(datetime, 'X').format('DD/MM - HH:mm:ss');
			return resultFormat;
		}
	},

	'getLastData' : function(){
		var machineDataObj  = MachineData.findOne({}, {sort: {datetimedata: -1}, limit: 1});
		var timeDataNow 		= moment.utc().unix();

			//Ve se o último estado é ligado ou desligado
			if(timeDataNow > machineDataObj.datetimedata[0]){
				//Diferença de tempo entre os dois ultimos registros;
				var dateNow = timeDataNow - machineDataObj.datetimedata[0];	//Formata entre horas e minutos
				if(dateNow<60){
					return "à 0 minutos";
				}else	if(dateNow > 3600){
					return " à " + moment.duration(dateNow, 'seconds').get('hours') + " H";
				}else{
					return " à " + moment.duration(dateNow, 'seconds').get('minutes') + " m";
				}
			}
			return "à 0 minutos";
		},

		'getTimeMachineRunning': function(){
	  //Pega o ultimo estado On
	  var lastOn  		= MachineData.findOne({"HardwareSignals.InDigs.0.InDig0.0": 1}, {sort: {datetimedata: -1}});
		//Pega o ultimo estado Off
		var lastOff			= MachineData.findOne({"HardwareSignals.InDigs.0.InDig0.0": 0}, {sort: {datetimedata: -1}});
		var timeDataNow = moment.utc().unix();

		//Se nenhum é indefinido
		if((lastOn !== undefined) && (lastOff !== undefined)){
			//Ve se o último estado é ligado ou desligado
			if(lastOn.datetimedata[0] > lastOff.datetimedata[0]){
				//Diferença de tempo entre os dois ultimos registros;
				var variavel = timeDataNow - lastOn.datetimedata[0];

				//Formata entre horas e minutos
				if(variavel<60){
					return "0 min";
				}else	if(variavel > 3600){
					return moment.duration(variavel, 'seconds').get('hours') + " H";
				}else{
					return moment.duration(variavel, 'seconds').get('minutes') + " m";
				}
			}else{
				var variavel = timeDataNow - lastOff.datetimedata[0];

				if(variavel > 3600){
					variavel = moment.duration(variavel, 'seconds').as('hours');
					variavel = variavel.toFixed(1).split('.');
					variavel[0] = variavel[0] + " h";
				}else{
					variavel = moment.duration(variavel, 'seconds').as('minutes');
					variavel = variavel.toFixed(1).split('.');
					variavel[0] = variavel[0] + " min";
				}
				return variavel[0];
			}
		}else{
			return "";
		}
	},

	'getMachineProfile' : function(){
		var thisMachine = Session.get('selectedMachine');
		var machineObj  = Machines.findOne(thisMachine);
		var valueArray  = machineObj.Profile.value;
		var unitArray   = machineObj.Profile.unit;
		var limitArray  = machineObj.Profile.limit;
		var resultArray = [];

		for(i = 0; i < valueArray.length; i++){
			resultArray[i] = [valueArray[i], unitArray[i], limitArray[i]];
		}

		return resultArray;
	},

	/*pega os dados totais da MachineData para apresentar no log*/
	'getMachineData': function(){
		var machineDataObj = MachineData.find({}, {sort: {datetimedata: -1 }, limit: 100}).fetch();
		return machineDataObj;
	},

	'getMachineSpeed': function(){
		var machineDataObj = MachineData.findOne({}, {sort: {datetimedata: -1}});
		var returnObj = machineDataObj.HardwareSignals.InAnls[0].InAnl0;
		return returnObj[returnObj.length-1];
	},

	'getMaxSpeed': function(){
		var machineDataObj = MachineData.findOne({}, {sort: {datetimedata: -1}});
		var returnObj = machineDataObj.HardwareSignals.InAnls[0].InAnl0;
		return Math.max(returnObj);
	},

	'getMinSpeed': function(){
		var machineDataObj = MachineData.findOne({}, {sort: {datetimedata: -1}});
		var returnObj = machineDataObj.HardwareSignals.InAnls[0].InAnl0;
		return Math.min(returnObj);
	},

	'getMachineValues': function(){
		var thisMachine = Session.get('selectedMachine');
		var machineObj  = Machines.findOne(thisMachine);
		var valueArray  = machineObj.Profile.value;

		return valueArray;
	},

	'getTemperatureLimits': function(){
		var thisMachine = Session.get('selectedMachine');
		var machineObj  = Machines.findOne(thisMachine);
		var limitArray  = machineObj.Profile.limit;

		var machineDataObj = MachineData.findOne({}, {sort: {datetimedata: -1}});
		var tempObj = machineDataObj.HardwareSignals.InAnls[0].InAnl0;
		if(limitArray[0] > tempObj[tempObj.length -1]){
			return true;
		}else{
			return false;
		}
	},

	'getLastTemp': function(){
		var machineDataObj = MachineData.findOne({}, {sort: {datetimedata: -1}});
		var returnObj = machineDataObj.HardwareSignals.InAnls[1].InAnl1;
		return returnObj[returnObj.length-1];
	},

	'getMaxTemp': function(){
		var machineDataObj = MachineData.findOne({}, {sort: {datetimedata: -1}});
		var returnObj = machineDataObj.HardwareSignals.InAnls[1].InAnl1;
		return Math.max(returnObj);
	},

	'getMinTemp': function(){
		var machineDataObj = MachineData.findOne({}, {sort: {datetimedata: -1}});
		var returnObj = machineDataObj.HardwareSignals.InAnls[1].InAnl1;
		return Math.min(returnObj);
	},

	'getMachine': function(){
		var thisMachine = Session.get('selectedMachine');
		return Machines.findOne(thisMachine);
	},

	'getHourCounter': function(){
		var thisMachine = Session.get('selectedMachine');
		var MachineObj =  Machines.findOne(thisMachine);
		var hours = MachineObj.hourcount;
		if(hours > 3600){
			hours = moment.duration(hours, 'seconds').as('hours');
			hours = hours.toFixed(1).split('.');
			hours[0] = hours[0] + " h";
		}else{
			hours = moment.duration(hours, 'seconds').as('minutes');
			hours = hours.toFixed(1).split('.');
			hours[0] = hours[0] + " min";
		}

		return hours[0];
	},

});
//********************************************************************************
// Events
//********************************************************************************
Template.infoDashboardModal.events({

	'click #temp' : function(event, template){
		console.log("temp");
	},

	'click #press' : function(event, template){
		console.log("press");
	},

	'click #speed' : function(event, template){
		console.log("speed");
	},

	'click #click-table' : function(event, template){
		template.find('#click-modal').click();
	},

});

Template.dashboard1.events({
	'click #exportPDF':function(event, template){
		var startDate = template.find('#start-date').value;
		var startTime = template.find('#start-time').value;
		var endDate = template.find('#end-date').value;
		var endTime = template.find('#end-time').value;

		startDate = startDate.split("/");
		startTime = startTime.split(":");
		var startString = parse('%s-%s-%s %s:%s', startDate[2], startDate[1], startDate[0], startTime[0], startTime[1]);
		var startUnix = moment.utc(startString, "YYYY-MM-DD h:mm A").unix(); //VALOR EM UNIXTIME UTC

		endDate = endDate.split("/");
		endTime = endTime.split(":");
		var endString = parse('%s-%s-%s %s:%s', endDate[2], endDate[1], endDate[0], endTime[0], endTime[1]);
		var endUnix = moment.utc(endString, "YYYY-MM-DD h:mm A").unix(); //VALOR EM UNIXTIME UTC
	},

	'click .modal-button':function(event, template){

		//slider da tabela da modal
		var lineInfo = this;
		Session.set('MACHINEDATAOBJ', lineInfo);
		Session.set('sliderDatatable', null);

		//Destrói o slider
		$('#sliderDatatable').empty();
		$('#sliderDatatable').removeAttr('class');

		if(lineInfo.datetimedata.length > 1){
			$("#sliderDatatable").noUiSlider({
				start: [Session.get('MACHINEDATAOBJ').datetimedata[0], Session.get('MACHINEDATAOBJ').datetimedata[Session.get('MACHINEDATAOBJ').datetimedata.length -1]],
				connect: true,
				step: 60,
				range: {
					'min': Session.get('MACHINEDATAOBJ').datetimedata[0],
					'max': Session.get('MACHINEDATAOBJ').datetimedata[Session.get('MACHINEDATAOBJ').datetimedata.length -1]
				}
			}).on('slide2', function (ev, val) {
      	// set real values on 'slide' event
      	Session.set('sliderDatatable', val);
      }).on('change', function (ev, val) {
      	Session.set('sliderDatatable', [Math.round(val[0]), Math.round(val[1])]);
      });
    }

    //slider do gráfico da modal
    var lineInfo = this;
    Session.set('MACHINEDATAOBJ', lineInfo);
    Session.set('sliderDatatable', null);

		//Destrói o slider
		$('#slider').empty();
		$('#slider').removeAttr('class');

		if(lineInfo.datetimedata.length > 1){
			$("#slider").noUiSlider({
				start: [Session.get('MACHINEDATAOBJ').datetimedata[0], Session.get('MACHINEDATAOBJ').datetimedata[Session.get('MACHINEDATAOBJ').datetimedata.length -1]],
				connect: true,
				step: 30,
				range: {
					'min': Session.get('MACHINEDATAOBJ').datetimedata[0],
					'max': Session.get('MACHINEDATAOBJ').datetimedata[Session.get('MACHINEDATAOBJ').datetimedata.length -1]
				}
			}).on('slide', function (ev, val) {
      	// set real values on 'slide' event
      	Session.set('slider', val);
      }).on('change', function (ev, val) {
      	Session.set('slider', [Math.round(val[0]), Math.round(val[1])]);
      	updateChart2();
      });
    }

		//Cria as variaveis necessarias
		var tempArray 				= [];
		var pressureArray 		= [];
		//var oilArray 					= [];
		var dateTimeArray 		= [];
		var formattedDateTime = [];

		//Joga as informações nos arrays que são utilizados no gráfico
		for(i = 0; i < lineInfo.datetimedata.length; i++){
			tempArray[i] 					= lineInfo.HardwareSignals.InAnls[1].InAnl1[i];
			pressureArray[i] 			= lineInfo.HardwareSignals.InAnls[2].InAnl2[i];
			//oilArray[i] 					= lineInfo.HardwareSignals.InAnls[0].InAnl0[i];
			dateTimeArray[i] 			= lineInfo.datetimedata;

			var resultFormatData = moment(dateTimeArray[i], 'X').format('DD/MM - HH:mm');
			formattedDateTime[i] 	= resultFormatData;
		}

		var data = {
			labels : formattedDateTime,
			datasets : [
			{
				label: "temp",//machineObj.Profile.value[0],
				fillColor : "rgba(128, 222, 234, 0.0)",
				strokeColor : "#e53935",
				pointColor : "#e53935",
				pointStrokeColor : "#e53935",
				pointHighlightFill : "#9e9e9e",
				//pointHighlightStroke : "#ffffff",
				data: tempArray,
				unit: "t"//machineObj.Profile.unit[0]
			},

			{
				label: "press",//machineObj.Profile.value[1],
				fillColor : "rgba(128, 222, 234, 0.0)",
				strokeColor : "#246BB2",
				pointColor : "#246BB2",
				pointStrokeColor : "#246BB2",
				pointHighlightFill : "#9e9e9e",
				//pointHighlightStroke : "#80cccc",
				data: pressureArray,
				unit: "p"//machineObj.Profile.unit[1]
			},
		// {
		// 	label: "Nível óleo",
		// 	fillColor : "rgba(117, 117, 117, 0.2)",
		// 	strokeColor : "#757575",
		// 	pointColor : "#757575",
		// 	pointStrokeColor : "#757575",
		// 	pointHighlightFill : "#9e9e9e",
		// 	//pointHighlightStroke : "#80cccc",
		// 	data: oilArray,
		// 	unit: "%",
		// },
		]
	};

	var trendingLineChart = template.find("#trending-line-chart-info-modal").getContext("2d");

	window.trendingLineChart = new Chart(trendingLineChart).Line(data, {
		scaleShowGridLines : true,///Boolean - Whether grid lines are shown across the chart
		scaleGridLineColor : "rgba(255,255,255,0.4)",//String - Colour of the grid lines
		scaleGridLineWidth : 1,//Number - Width of the grid lines
		scaleShowHorizontalLines: true,//Boolean - Whether to show horizontal lines (except X axis)
		scaleShowVerticalLines: false,//Boolean - Whether to show vertical lines (except Y axis)
		bezierCurve : true,//Boolean - Whether the line is curved between points
		bezierCurveTension : 0.4,//Number - Tension of the bezier curve between points
		pointDot : true,//Boolean - Whether to show a dot for each point
		pointDotRadius : 5,//Number - Radius of each point dot in pixels
		pointDotStrokeWidth : 2,//Number - Pixel width of point dot stroke
		pointHitDetectionRadius : 20,//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
		datasetStroke : true,//Boolean - Whether to show a stroke for datasets
		datasetStrokeWidth : 3,//Number - Pixel width of dataset stroke
		datasetFill : true,//Boolean - Whether to fill the dataset with a colour
		animationSteps: 15,// Number - Number of animation steps
		animationEasing: "easeOutQuart",// String - Animation easing effect
		tooltipTitleFontFamily: "'Roboto','Helvetica Neue', 'Helvetica', 'Arial', sans-serif",// String - Tooltip title font declaration for the scale label
		scaleFontSize: 12,// Number - Scale label font size in pixels
		scaleFontStyle: "normal",// String - Scale label font weight style
		scaleFontColor: "#fff",// String - Scale label font colour
		tooltipEvents: ["mousemove", "touchstart", "touchmove"],// Array - Array of string names to attach tooltip events
		tooltipFillColor: "rgba(255,255,255,0.8)",// String - Tooltip background colour
		tooltipTitleFontFamily: "'Roboto','Helvetica Neue', 'Helvetica', 'Arial', sans-serif",// String - Tooltip title font declaration for the scale label
		tooltipFontSize: 12,// Number - Tooltip label font size in pixels
		tooltipFontColor: "#000",// String - Tooltip label font colour
		tooltipTitleFontFamily: "'Roboto','Helvetica Neue', 'Helvetica', 'Arial', sans-serif",// String - Tooltip title font declaration for the scale label
		tooltipTitleFontSize: 0,// Number - Tooltip title font size in pixels
		tooltipTitleFontStyle: "bold",// String - Tooltip title font weight style
		tooltipTitleFontColor: "#000",// String - Tooltip title font colour
		tooltipYPadding: 8,// Number - pixel width of padding around tooltip text
		tooltipXPadding: 16,// Number - pixel width of padding around tooltip text
		tooltipCaretSize: 10,// Number - Size of the caret on the tooltip
		tooltipCornerRadius: 6,// Number - Pixel radius of the tooltip border
		tooltipXOffset: 10,// Number - Pixel offset from point x to tooltip edge
		responsive: true,
		scaleShowLabels: true,
		multiTooltipTemplate: "<%= datasetLabel %> - <%= value %><%= datasetUnit %>"
	});
},

});


// Template.insertTimelineEventModal.events({
// 	'change #eventType': function(event) {
// 		Session.set("selectedType", event.currentTarget.value);
// 		var userObj = Meteor.user();

// 		if(Roles.userIsInRole(userObj, 'Operator')){
// 			document.getElementById('secondStep').click();
// 		}
// 	},

// 	'click .option-card':function(event){
// 		Session.set("selectedType", this.type);
// 		document.getElementById('secondStep').click();
// 	},

// 	'click .event-option':function(event){
// 		document.getElementById('thirdStep').click();
// 	},

	// 'click #insertTimelineEvents':function(event, template){
	// 	var userObj = Meteor.user();

	// 	var newEvent = {
	// 		_idMachine 	: Session.get('selectedMachine'),
	// 		type    		: Session.get('selectedType'),
	// 		name    		: template.find('input:radio[name=group1]:checked').value,
	// 		description : template.find('#eventDescription').value,
	// 	}

	// 	var callNewEvent = Meteor.call('insertTimeLineMtd', newEvent, function(error, result){
	// 		if(result == true){
	// 			Materialize.toast("Evento inserido com sucesso!", 3000);
	// 		}else{
	// 			Materialize.toast("Erro ao inserir evento", 3000);
	// 		}
	// 	})

	// 	Session.set('selectedType', null);
	// 	template.find('input:radio[name=group1]:checked').value = "";
	// 	template.find('#description-form').reset();
	// 	if(Roles.userIsInRole(userObj, 'Operator')){
	// 		document.getElementById('firstStep').click();
	// 	}
	// 	document.getElementById('close-event-modal').click();
	// }

//});

//********************************************************************************
// Lifecycle Hook
//********************************************************************************
Template.insertTimelineEventModal.onRendered(function() {
	$('select').select2();
});

Template.dashboard1.onCreated( function() {

});

Template.infoDashboardModal.onCreated( function() {

});

Template.infoDashboardModal.onRendered( function() {

	$('.tooltipped').tooltip({delay: 50});

	$('ul.tabs').tabs();

	//slider do gráfico da modal
	this.$("#slider").noUiSlider({
		start: [0, 1],
		connect: true,
		step: 60,
		range: {
			'min': 0,
			'max': 1
		},
	}).on('slide', function (ev, val) {
      // set real values on 'slide' event
      Session.set('slider', val);
    }).on('change', function (ev, val) {
    	Session.set('slider', [Math.round(val[0]), Math.round(val[1])]);
    	updateChart2();
    });

    //slider da tabela da modal
    this.$("#sliderDatatable").noUiSlider({
    	start: [0, 1],
    	connect: true,
    	step: 60,
    	range: {
    		'min': 0,
    		'max': 1
    	},
    }).on('slide2', function (ev, val) {
      // set real values on 'slide' event
      Session.set('sliderDatatable', val);
    }).on('change', function (ev, val) {
    	Session.set('sliderDatatable', [Math.round(val[0]), Math.round(val[1])]);
    });


		// CONFIGURAÇAO DATA TABLE
		$('#data-table-dashboard-modal').DataTable( {
			"order": [[ 0, "desc" ]],
			"scrollY":        "210px",
			"scrollCollapse": true,
			"paging":         false,
			"searching": false,
			"language": {
				"sEmptyTable": "Nenhum registro encontrado",
				"sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
				"sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
				"sInfoFiltered": "(Filtrados de _MAX_ registros)",
				"sInfoPostFix": "",
				"sInfoThousands": ".",
				"sLengthMenu": "Mostrar _MENU_",
				"sLoadingRecords": "Carregando...",
				"sProcessing": "Processando...",
				"sZeroRecords": "Nenhum registro encontrado",
				"sSearch": "Pesquisar",
				"oPaginate": {
					"sNext": "Próximo",
					"sPrevious": "Anterior",
					"sFirst": "Primeiro",
					"sLast": "Último"
				},
				"oAria": {
					"sSortAscending": ": Ordenar colunas de forma ascendente",
					"sSortDescending": ": Ordenar colunas de forma descendente"
				},
			},
		});

	});

Template.dashboard1.onRendered( function() {
	// var now = moment.utc().unix();
	// //Importação de dados do banco para o gráfico
	// var thisMachine = Session.get('selectedMachine');
	// var thisDevice 	= Devices.findOne({_idMachine:thisMachine});
	// //Busca as informações no banco
	// var dataArray = DeviceData.find({_idDevice:thisDevice._id}, {sort: {datetimedata:-1}, limit: 7}).fetch();
	// dataArray.reverse();
	// //Cria as variaveis necessarias
	// var tempArray 				= [];
	// var pressureArray 		= [];
	// var oilArray 					= [];
	// var dateTimeArray 		= [];
	// var formattedDateTime = [];
	// //Joga as informações nos arrays que são utilizados no gráfico
	// for(i = 0; i < 7; i++){
	// 	tempArray[i] 					= dataArray[i].Data.temp;
	// 	pressureArray[i] 			= dataArray[i].Data.pressure;
	// 	oilArray[i] 					= dataArray[i].Data.oil;
	// 	dateTimeArray[i] 			= dataArray[i].datetimedata;

	// 	var resultFormatData = moment(dateTimeArray[i], 'X').format('DD/MM - HH:mm');
	// 	formattedDateTime[i] 	= resultFormatData;
	// }

	$('.tooltipped').tooltip({delay: 50});

	$('ul.tabs').tabs();

	$('.modal-trigger').leanModal({
		dismissible: true
	});

	  // Pikadate datepicker
	  $('#start-date').pickadate({
    selectMonths: false, // Creates a dropdown to control month
    selectYears: 5, // Creates a dropdown of 15 years to control year
    closeOnSelect: true,
    format: 'dd/mm/yyyy',
    labelMonthNext: 'Próximo Mês',
    labelMonthPrev: 'Mês Anterior',
    labelMonthSelect: 'Selecione o Mês',
    labelYearSelect: 'Selecione o Ano',
    monthsFull: [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ],
    monthsShort: [ 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez' ],
    weekdaysFull: [ 'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado' ],
    weekdaysShort: [ 'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb' ],
    weekdaysLetter: [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ],
    today: 'Hoje',
    clear: 'Limpar',
    close: 'Fechar'
  });

	  // Pikadate datepicker
	  $('#end-date').pickadate({
    selectMonths: false, // Creates a dropdown to control month
    selectYears: 5, // Creates a dropdown of 15 years to control year
    closeOnSelect: true,
    format: 'dd/mm/yyyy',
    labelMonthNext: 'Próximo Mês',
    labelMonthPrev: 'Mês Anterior',
    labelMonthSelect: 'Selecione o Mês',
    labelYearSelect: 'Selecione o Ano',
    monthsFull: [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ],
    monthsShort: [ 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez' ],
    weekdaysFull: [ 'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado' ],
    weekdaysShort: [ 'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb' ],
    weekdaysLetter: [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ],
    today: 'Hoje',
    clear: 'Limpar',
    close: 'Fechar'
  });


		// CONFIGURAÇAO DATA TABLE
		$('#data-table-dashboard1').DataTable( {
			"order": [[ 0, "desc" ]],
			"language": {
				"sEmptyTable": "Nenhum registro encontrado",
				"sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
				"sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
				"sInfoFiltered": "(Filtrados de _MAX_ registros)",
				"sInfoPostFix": "",
				"sInfoThousands": ".",
				"sLengthMenu": "Mostrar _MENU_",
				"sLoadingRecords": "Carregando...",
				"sProcessing": "Processando...",
				"sZeroRecords": "Nenhum registro encontrado",
				"sSearch": "Pesquisar",
				"oPaginate": {
					"sNext": "Próximo",
					"sPrevious": "Anterior",
					"sFirst": "Primeiro",
					"sLast": "Último"
				},
				"oAria": {
					"sSortAscending": ": Ordenar colunas de forma ascendente",
					"sSortDescending": ": Ordenar colunas de forma descendente"
				},
			},
		});

		$('select').material_select();

	});

Template.dashboard1.onDestroyed( function() {

});

Template.infoDashboardModal.onDestroyed( function() {
	delete Session.keys['slider'];
});

}