//================================================================================
//  @file         coDashboard.js
//  @version      0.0.1
//  @path         client/_controllers/
//  @description  CONTROLLER para Dashboards.
//  @author       MateusDeveloper
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

if (Meteor.isClient) {

	parse = function(str) {
		var args = [].slice.call(arguments, 1),i = 0;

		return str.replace(/%s/g, function() {
			return args[i++];
		});
	}

	getBarData = function(now){
		var returnArray = [];
		var thisMachine = Session.get('selectedMachine');

		var data = DailyReport.find({_idMachine:thisMachine},
			{sort: {datetimedata:-1}, fields: {"Data.load": 1, "datetimedata": 1}, limit: 5}).fetch();

		for(i = 0; i < data.length; i++){
			returnArray.push(data[i].Data.load);
			returnArray.push(data[i].datetimedata);
		}

		return returnArray;
	}

	returnLoadPercentages = function(newUnixTime, oldUnixTime) {
		var	before = newUnixTime - oldUnixTime;
		var dataArray = MachineData.find({},
			{sort: {datetimedata:-1}}).fetch();
		var carga = 0
		var alivio = 0;

		for(i = 0; i < dataArray.length; i++){
			if( dataArray[i].HardwareSignals.InDigs[1].InDig1[0] == 1){
				var firstTime = dataArray[i].datetimedata[0];
				var lastTime  = dataArray[i].datetimedata[dataArray[i].datetimedata.length - 1];
				carga = (lastTime - firstTime) + carga;
			}else{
				var firstTime = dataArray[i].datetimedata[0];
				var lastTime  = dataArray[i].datetimedata[dataArray[i].datetimedata.length - 1];
				alivio = (lastTime - firstTime) + alivio;
			}
		}
		var soma = carga+alivio;
		carga = (carga*100)/soma;
		carga = carga | 0;
		alivio = (alivio*100)/soma;
		alivio = alivio | 0;

		return [carga, alivio];
	}

	updateChart = function(){
		var now = moment.utc().unix();
		//Busca as informações no banco
		var dataArray = MachineData.find({}, {sort: {datetimedata:-1}, limit: 7}).fetch();
		dataArray.reverse();
		if(dataArray == 0){
			return false;
		}else{
			var dateTimeArray = [];
			var formattedDateTime = [];
			//Joga as informações nos arrays que são utilizados no gráfico
			for(i = 0; i < dataArray.length; i++){
				trendingLineChart.datasets[0].points[i].value = dataArray[i].HardwareSignals.InAnls[0].InAnl0;
				trendingLineChart.datasets[1].points[i].value = dataArray[i].HardwareSignals.InAnls[1].InAnl1;
				// trendingLineChart.datasets[2].points[i].value = dataArray[i].Data.oil;
				dateTimeArray[i] = dataArray[i].datetimedata;

				var resultFormatData = moment(dateTimeArray[i], 'X').format('DD/MM - HH:mm');
				formattedDateTime[i] = resultFormatData;
			}
			trendingLineChart.scale.xLabels = formattedDateTime;
			trendingLineChart.update();


			//Busca as informações no banco
			var newDoughnutValues = returnLoadPercentages(now, 86400);

			doughnutChart.segments[0].value = newDoughnutValues[0];
			doughnutChart.segments[1].value = newDoughnutValues[1];

			doughnutChart.update();

			var newBarValues = getBarData();
			var cargaArray = [];
			var dateArray = [];

			for(h = 0; h < 10; h++){
				cargaArray.push(newBarValues[h]);
				h++;
				dateArray.push(newBarValues[h]);
			}
			cargaArray.reverse();
			dateArray.reverse();

			for(h = 0; h < 0; h++){//DataSets = [Carga, Alivio], bars = dias da semana
				trendingBarChart.datasets[0].bars[h].value = cargaArray[h];
				trendingBarChart.datasets[1].bars[h].value = (100 - newBarValues[h]);
			}

			trendingBarChart.update();

			return false;
		}
	},

//********************************************************************************
// Helpers
//********************************************************************************
Template.dashboard0.helpers({
	'getMachine': function(){
		var thisMachine = Session.get('selectedMachine');
		return Machines.findOne(thisMachine);
	},

	'getMachineLog': function(){
		return MachineData.find({}, {sort: {datetimedata:-1}, limit:50});
	},

	'getMachineEvent': function(){
		var now = moment.utc().unix();
		var before = now - 86400;
		return TimelineEvents.find({datetimeevent:{$gt: before,$lt: now}}, {sort: {datetimeevent:-1}});
	},

	'getColor': function(eventTypeId){
		var thisType = EventType.findOne({_id: eventTypeId});
		var color = thisType.color;
		return color;
	},

	'getIcon': function(eventTypeId){
		var thisType = EventType.findOne({_id: eventTypeId});
		var icon = thisType.icon;
		return icon;
	},

	'getUserName': function(userId){
		var UserObj = Meteor.users.findOne({_id: userId});
		if(UserObj == undefined){
			return "Mensagem do Sistema";
		}else{
			return UserObj.profile.name;
		}
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

	'formatDate': function(datetime){
		if(datetime == undefined){
			return "Data Inválida!";
		}else{
			var resultFormat = moment(datetime, 'X').format('DD/MM/YYYY HH:mm:ss');
			return resultFormat;
		}
	},

	'formatDateChart': function(datetime){
		if(datetime == undefined){
			return "Data Inválida!";
		}else{
			var resultFormat = moment(datetime, 'X').format('DD/MM - HH:mm');
			return resultFormat;
		}
	},


});

Template.insertTimelineEventModal.helpers({
	'getTypes': function(eventId){
		var typeObj = EventType.find({visible: 1}).fetch();
		return typeObj;
	},

	'getEvents': function(template){
		//Salva em listObj a Lista relativa a Maquina
		var listObj = EventList.findOne({});
    //Salva em storage os eventos da Lista
    var storage = listObj.Events;
    //Pega o valor do select type
    var selectedType = Session.get('selectedType');
  	//Busca na coleção EventType o Objeto
  	var typeObj = EventType.findOne({type: selectedType});
  	if(typeObj !== undefined){
    //Joga false no return
    var result = [];
    //Percorre o array de eventos, salvando o obj em result se o id bater com o eventtype
    for(i = 0; i < storage.length; i++){
    	var test = storage[i]._idEventType;
    	var test2 = typeObj._id;
    	if(test.valueOf() === test2.valueOf()){
    		var foo = storage[i];
    		result.push(foo);
    	}
    }
    return result;
  }else{
  	return false;
  }
},

'getTypeName': function(eventId){
	var typeObj = EventType.findOne({_id: eventId});
	var eventName = typeObj.type;
	return eventName;
},

});

//********************************************************************************
// Events
//********************************************************************************
Template.dashboard0.events({
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

		// var HTML2PDF = function demoFromHTML() {
		// 	var pdf = new jsPDF('p', 'pt', 'letter');
	 //    // source can be HTML-formatted string, or a reference
	 //    // to an actual DOM element from which the text will be scraped.
	 //    source = $('#mecaguei')[0];
	 //    // we support special element handlers. Register them with jQuery-style
	 //    // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
	 //    // There is no support for any other type of selectors
	 //    // (class, of compound) at this time.
	 //    specialElementHandlers = {
	 //      // element with id of "bypass" - jQuery style selector
	 //      '#bypassme': function (element, renderer) {
	 //        // true = "handled elsewhere, bypass text extraction"
	 //        return true
	 //      }
	 //    };
	 //    margins = {
	 //    	top: 80,
	 //    	bottom: 60,
	 //    	left: 40,
	 //    	width: 522
	 //    };
		//     // all coords and widths are in jsPDF instance's declared units
		//     // 'inches' in this case
		//     pdf.fromHTML(
		//     source, // HTML string or DOM elem ref.
		//     margins.left, // x coord
		//     margins.top, { // y coord
		//         'width': margins.width, // max width of content on PDF
		//         'elementHandlers': specialElementHandlers
		//       },


		//       function (dispose) {
	 //        // dispose: object with X, Y of the last line add to the PDF
	 //        //          this allow the insertion of new lines after html
	 //        pdf.save('Test.pdf');
	 //      }, margins);
		//   };
		//   return HTML2PDF();

	}

});


Template.insertTimelineEventModal.events({
	'change #eventType': function(event) {
		Session.set("selectedType", event.currentTarget.value);
		var userObj = Meteor.user();

		if(Roles.userIsInRole(userObj, 'Operator')){
			document.getElementById('secondStep').click();
		}
	},

	'click .option-card':function(event){
		Session.set("selectedType", this.type);
		document.getElementById('secondStep').click();
	},

	'click .event-option':function(event){
		document.getElementById('thirdStep').click();
	},

	'click #insertTimelineEvents':function(event, template){
		var userObj = Meteor.user();

		var newEvent = {
			_idMachine 	: Session.get('selectedMachine'),
			type    		: Session.get('selectedType'),
			name    		: template.find('input:radio[name=group1]:checked').value,
			description : template.find('#eventDescription').value,
		}

		var callNewEvent = Meteor.call('insertTimeLineMtd', newEvent, function(error, result){
			if(result == true){
				Materialize.toast("Evento inserido com sucesso!", 3000);
			}else{
				Materialize.toast("Erro ao inserir evento", 3000);
			}
		})

		Session.set('selectedType', null);
		template.find('input:radio[name=group1]:checked').value = "";
		template.find('#description-form').reset();
		if(Roles.userIsInRole(userObj, 'Operator')){
			document.getElementById('firstStep').click();
		}
		document.getElementById('close-event-modal').click();
	}

});


//********************************************************************************
// Lifecycle Hook
//********************************************************************************
Template.insertTimelineEventModal.onRendered(function() {
	$('select').select2();
});

Template.dashboard0.onCreated( function() {
	updateInterval = Meteor.setInterval(updateChart, 30000);
});

Template.dashboard0.onRendered( function() {
	var thisMachine = Session.get('selectedMachine');
	var now = moment.utc().unix();
	//Importação de dados do banco para o gráfico
	var machineObj = Machines.findOne(thisMachine);
	//Busca as informações no banco
	var dataArray = MachineData.find({}, {sort: {datetimedata:-1}, limit: 7}).fetch();
	dataArray.reverse();
	//Cria as variaveis necessarias
	var tempArray 				= [];
	var pressureArray 		= [];
	//var oilArray 					= [];
	var dateTimeArray 		= [];
	var formattedDateTime = [];
	//Joga as informações nos arrays que são utilizados no gráfico
	for(i = 0; i < dataArray.length; i++){
		tempArray[i] 					=dataArray[i].HardwareSignals.InAnls[0].InAnl0;
		pressureArray[i] 			= dataArray[i].HardwareSignals.InAnls[1].InAnl1;
		//oilArray[i] 					= dataArray[i].Data.oil;
		dateTimeArray[i] 			= dataArray[i].datetimedata;

		var resultFormatData = moment(dateTimeArray[i], 'X').format('DD/MM - HH:mm');
		formattedDateTime[i] 	= resultFormatData;
	}

	var data = {
		labels : formattedDateTime,
		datasets : [
		{
			label: machineObj.Profile.value[0],
			fillColor : "rgba(128, 222, 234, 0.0)",
			strokeColor : "#e53935",
			pointColor : "#e53935",
			pointStrokeColor : "#e53935",
			pointHighlightFill : "#9e9e9e",
			//pointHighlightStroke : "#ffffff",
			data: tempArray,
			unit: machineObj.Profile.unit[0]
		},
		{
			label: machineObj.Profile.value[1],
			fillColor : "rgba(128, 222, 234, 0.0)",
			strokeColor : "#246BB2",
			pointColor : "#246BB2",
			pointStrokeColor : "#246BB2",
			pointHighlightFill : "#9e9e9e",
			//pointHighlightStroke : "#80cccc",
			data: pressureArray,
			unit: machineObj.Profile.unit[1]
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


	/*
	GRAFICO ESTADO DE MAQUINA
	*/
	var now = moment.utc().unix();
	var doughnutValues = returnLoadPercentages(now, 86400);

	var doughnutData = [
	{
		value: doughnutValues[0],
		color: "#F7464A",
		highlight: "#FF5A5E",
		label: "Carga"
	},
	{
		value: doughnutValues[1],
		color:"#46BFBD",
		highlight: "#5AD3D1",
		label: "Alivio"
	}

	];


	var newBarValues = getBarData();
	var cargaArray = [];
	var alivioArray = [];
	var dateArray = [];

	for(h = 0; h < 10; h++){//DataSets = [Carga, Alivio], bars = dias da semana
		cargaArray.push(newBarValues[h]);
		alivioArray.push(100 - newBarValues[h]);
		h++;
		dateArray.push(newBarValues[h]);
	}
	cargaArray.reverse();
	alivioArray.reverse();
	dateArray.reverse();

	var dataBarChart = {
		labels : [moment.utc(dateArray[0], 'X').format('ddd'), moment.utc(dateArray[1], 'X').format('ddd'),
		moment.utc(dateArray[2], 'X').format('ddd'), moment.utc(dateArray[3], 'X').format('ddd'),
		moment.utc(dateArray[4], 'X').format('ddd')],
		datasets: [
		{
			label: "Carga",
			fillColor: "#F7464A",
			strokeColor: "#F7464A",
			highlightFill: "#FF5A5E",
			highlightStroke: "#FF5A5E",
			data: cargaArray,
		},
		{
			label: "Alivio",
			fillColor: "#46BFBD",
			strokeColor: "#46BFBD",
			highlightFill: "#5AD3D1",
			highlightStroke: "#5AD3D1",
			data: alivioArray,
		}
		]
	};

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
    monthsFull: [ 'Janeiros', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ],
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
    monthsFull: [ 'Janeiros', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ],
    monthsShort: [ 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez' ],
    weekdaysFull: [ 'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado' ],
    weekdaysShort: [ 'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb' ],
    weekdaysLetter: [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ],
    today: 'Hoje',
    clear: 'Limpar',
    close: 'Fechar'
  });

	// JAVASCRIPT DA TIMELINE
	$(document).ready(function($){
		var timelineBlocks = $('.cd-timeline-block'),
		offset = 0.8;

	//hide timeline blocks which are outside the viewport
	hideBlocks(timelineBlocks, offset);

	//on scolling, show/animate timeline blocks when enter the viewport
	$(window).on('scroll', function(){
		(!window.requestAnimationFrame)
		? setTimeout(function(){ showBlocks(timelineBlocks, offset); }, 100)
		: window.requestAnimationFrame(function(){ showBlocks(timelineBlocks, offset); });
	});

	function hideBlocks(blocks, offset) {
		blocks.each(function(){
			( $(this).offset().top > $(window).scrollTop()+$(window).height()*offset ) && $(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
		});
	}

	function showBlocks(blocks, offset) {
		blocks.each(function(){
			( $(this).offset().top <= $(window).scrollTop()+$(window).height()*offset && $(this).find('.cd-timeline-img').hasClass('is-hidden') ) && $(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
		});
	}
});

		// CONFIGURAÇAO DATA TABLE
		$('#data-table-dashboard0').DataTable( {
			"order": [ 0, "desc" ],
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


// CONFIGURAÇÔES DE EXIBIÇÂO DOS GRAFICOS

var trendingLineChart = this.find("#trending-line-chart").getContext("2d");

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


var doughnutChart = this.find("#doughnut-chart").getContext("2d");
window.doughnutChart = new Chart(doughnutChart).Doughnut(doughnutData, {
	segmentStrokeColor : "#fff",
			tooltipTitleFontFamily: "'Roboto','Helvetica Neue', 'Helvetica', 'Arial', sans-serif",// String - Tooltip title font declaration for the scale label
			percentageInnerCutout : 50,
			animationSteps : 15,
			segmentStrokeWidth : 2,
			animateScale: true,
			percentageInnerCutout : 8,
			responsive : true,
			tooltipTemplate: "<%= label %>: <%= value %>%",
		});

var trendingBarChart = this.find("#trending-bar-chart").getContext("2d");
window.trendingBarChart = new Chart(trendingBarChart).Bar(dataBarChart,{
			scaleShowGridLines : false,//Boolean - Whether grid lines are shown across the chart
			showScale: true,
			animationSteps:15,
			tooltipTitleFontFamily: "'Roboto','Helvetica Neue', 'Helvetica', 'Arial', sans-serif",// String - Tooltip title font declaration for the scale label
			responsive : true
		});
});

Template.dashboard0.onDestroyed( function() {
	Meteor.clearInterval(updateInterval);
});
}