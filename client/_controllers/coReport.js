//================================================================================
//  @file         coUsers.js
//  @version      0.0.1
//  @path         client/_controllers/
//  @description  CONTROLLER para Users.
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

if (Meteor.isClient) {
	exportCSV = function() {
		var self = this;

		var thisMachine = Machines.findOne(Session.get('SELECTED_MACHINE'));

		var objectCSV = {
			beforeFilter: Session.get('END_DATE_FILTER'),
			afterFilter	: Session.get('START_DATE_FILTER'),
			machineId 	: Session.get('SELECTED_MACHINE'),
			type 				: Session.get('SELECTED_TYPE_REPORT'),
			machineName : thisMachine.name
		}

		Meteor.call("exportCSV", objectCSV, function(error, data) {

			if ( error ) {
				alert(error);
				return false;
			}

			var csv = Papa.unparse(data);
			self._downloadCSV(csv);
		});
	},

	_downloadCSV = function(csv) {
		var blob = new Blob([csv]);
		var a = window.document.createElement("a");
		a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
		a.download = "report.csv";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
}

//********************************************************************************
// Helpers
//********************************************************************************
Template.report.helpers({
	/*START HELPER FOR FILTER*/
	'getMachines': function(){
		var machinesList = Machines.find().fetch();
		return machinesList;
	},

	'hideSelectType': function(){
		var machineSelected = Session.get("SELECTED_MACHINE");
		if(machineSelected != undefined) {
			return true
		} else{
			return false
		}
	},

	'getMachineSelected': function(){
		var machineSelected = Session.get("SELECTED_MACHINE");
		if(machineSelected != undefined) {
			var thisMachineObj = Machines.findOne({_id: machineSelected});
			return thisMachineObj;
		} else{
			return false;
		}
	},

	'isCompressor': function(typeMachine){
		if(typeMachine == 0){
			return true
		} else{
			return false;
		}
	},

	'isOtherMachine': function(typeMachine){
		if(typeMachine == 1){
			return true
		} else{
			return false;
		}
	},
	/*END HELPER FOR FILTER*/


	/*START HELPER FOR PREVIEW REPORT*/
	'reportView': function(){
		if((Session.get('FILTER_CONFIGURED') == true) &&  Template.instance().subscriptionsReady()){
			return true;
		}else{
			return false;
		}
	},

	'getMachine': function(){
		var thisMachine = Session.get('SELECTED_MACHINE');
		return Machines.findOne(thisMachine);
	},

	'getFilterDate': function(){
		var before = moment(Session.get('END_DATE_FILTER'), 'X').format('DD/MM/YYYY - HH:mm:ss');
		var after = moment(Session.get('START_DATE_FILTER'), 'X').format('DD/MM/YYYY - HH:mm:ss');

		return "De "+ before + " até " + after;
	},

	'getTypeReport': function(){
		var selectedTypeReport = Session.get('SELECTED_TYPE_REPORT');
		if(selectedTypeReport != undefined){
			if(selectedTypeReport == "all"){
				return "Relatório Geral";
			}else if(selectedTypeReport == "productivity"){
				return "Relatório de Produtividade";
			}else if(selectedTypeReport == "poweronoff"){
				return "Relatório de Funcionamento";
			}else if(selectedTypeReport == "resume"){
				return "Totalizadores Diários";
			}else {
				return false
			}
		}else {
			return false;
		}
	},

	'reportIsAll': function(){
		var selectedTypeReport = Session.get('SELECTED_TYPE_REPORT');
		if(selectedTypeReport == "all"){
			return true;
		}else {
			return false
		}
	},

	'machineIsCompressor': function(){
		var selectedMachineId = Session.get('SELECTED_MACHINE');
		var selectedMachineObj = Machines.findOne(selectedMachineId);
		if(selectedMachineObj.dashcode == 0){
			return true;
		}else {
			return false
		}
	},

	'machineIsCounterProduction': function(){
		var selectedMachineId = Session.get('SELECTED_MACHINE');
		var selectedMachineObj = Machines.findOne(selectedMachineId);
		if(selectedMachineObj.dashcode == 1){
			return true;
		}else {
			return false
		}
	},

	'getHourCounter': function(){
		var thisMachine = Session.get('SELECTED_MACHINE');
		var MachineObj =  Machines.findOne(thisMachine);
		var hours = MachineObj.hourcount[1];
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

	'getMachineDataReport': function(){
		var storageMachineData = MachineData.find({}, {sort: {datetimedata:-1}, limit:5000}).fetch();
		// console.log(storageMachineData);
		var anl1Array = [];
		var anl2Array = [];
		var dateTimeArray = [];
		var count = 0;
		for(i = 0; i < storageMachineData.length; i++){
			for(j = 0; j < storageMachineData[i].datetimedata.length; j++){
				anl1Array.push(storageMachineData[i].HardwareSignals.InAnls[1].InAnl1[j]);
				anl2Array.push(storageMachineData[i].HardwareSignals.InAnls[2].InAnl2[j]);
				dateTimeArray.push(storageMachineData[i].datetimedata[j]);

			}
		}

		// console.log(anl1Array);
		// console.log(anl2Array);
		// console.log(dateTimeArray);

		Session.set('MACHINE_DATA_COUNT', count);

		return MachineData.find({}, {sort: {datetimedata:-1}, limit:5000}).fetch();
	},

	'test': function(MachineData){
		console.log(MachineData);
		console.log(MachineData.datetimedata.length);
		var arrayReturn = [];
		for(i=0; i< MachineData.datetimedata.length; i++){
				// arrayReturn.push([MachineData.datetimedata[i], MachineData.HardwareSignals.InAnls[1].InAnl1[i], MachineData.HardwareSignals.InAnls[2].InAnl1[i]]);
				arrayReturn.push(["A", "B", "C", "D"]);
			}
			console.log(arrayReturn);
			return arrayReturn;
		},

		'formatDate': function(datetime){
			if(datetime == undefined){
				return "Data Inválida!";
			}else{
			//'X' é utilizado para definir que o moment está em UNIXTIME.
			var resultFormat = moment(datetime, 'X').format('DD/MM/YYYY HH:mm:ss');
			return resultFormat;
		}
	},

});

//********************************************************************************
// Events
//********************************************************************************
Template.report.events({
	'change #machine-selector': function(event) {
		var machineId = event.currentTarget.value;
		var machineId = removeObject(machineId);
		var machineId = new Mongo.ObjectID(machineId);
		Session.set("SELECTED_MACHINE", machineId);
		Session.set('FILTER_CONFIGURED', false);
	},

	'change #select-type-report': function(event) {
		Session.set("SELECTED_TYPE_REPORT", event.currentTarget.value);
		Session.set('FILTER_CONFIGURED', false);
	},

	/*Preview do Relatório*/
	'click #preview-report-button':function(event, template){
		// var nameReport = template.find('#report-name').value;
		// Session.set('NAME_REPORT', nameReport);
		var startDate = template.find('#start-date').value;
		var endDate = template.find('#end-date').value;

		/*Data de Início do Filtro*/
		startDate = startDate.split("/");
		var startString = parse('%s-%s-%s %s:%s', startDate[2], startDate[1], startDate[0], "00", "00");
		var startUnix = moment.utc(startString, "YYYY-MM-DD h:mm A").unix(); //VALOR EM UNIXTIME UTC

		/*Data de Início do Filtro*/
		endDate = endDate.split("/");
		var endString = parse('%s-%s-%s %s:%s', endDate[2], endDate[1], endDate[0], "59", "59"); //data com horário
		var endUnix = moment.utc(endString, "YYYY-MM-DD h:mm A").unix(); //VALOR EM UNIXTIME UTC

		Session.set("START_DATE_FILTER", startUnix);
		Session.set("END_DATE_FILTER", endUnix);

		Template.instance().subscribe("report", Session.get('START_DATE_FILTER'), Session.get('END_DATE_FILTER'), Session.get('SELECTED_MACHINE'), Session.get('SELECTED_TYPE_REPORT'));
		Session.set("FILTER_CONFIGURED", true);

	},

// 	/*Gerar o PDF*/
// 	'click #exportPDF': function(event, template) {
// 		var pdf = new jsPDF('p', 'pt', 'a4');

// 		source = $('#thisPDF')[0];

// 		margins = {
// 			top: 40,
// 			bottom: 20,
// 			left: 40,
// 			width: 510
// 		};

// 		pdf.fromHTML(
// 	 	   source,
// 	 	   margins.left,
// 	 	   margins.top, {
//   	      'width': margins.width,
// 	 	   },

//   	    function (dispose) {
//   	    	pdf.save('Relatório_SystemMonitorMachine.pdf');
// 	 	 	}, margins );
// },

/*Gerar o PDF*/
'click #exportPDF': function(event, template) {
	var doc = new jsPDF();
	Header = function () {
		// doc.addImage('images/LogoHome.png', 'JPEG', 15, 40, 180, 180);
		doc.line(200, 20, 10, 20);
	}

	Footer = function (page) {
		doc.line(200, 20, 10, 20);
		doc.setTextColor(100);
		doc.setFontSize(10);
		doc.text(20, 27, 'Relatório SystemMonitorMachine');
		doc.text(178, 27, 'Página ' + page);
	}

	doc.addPage();
	Header();

	doc.addPage();
	Footer(125);

	doc.addPage();


var columns = ["ID", "Name", "Country"];
var rows = [
    [1, "Shaw", "Tanzania"],
    [2, "Nelson", "Kazakhstan"],
    [3, "Garcia", "Madagascar"],
];

	doc.autoTable(columns, rows, {});

	doc.save('Relatório_SystemMonitorMachine.pdf');
},

'click #exportCSV': function(event, template) {
	exportCSV();
}
});



//********************************************************************************
// Lifecycle Hook
//********************************************************************************

Template.report.onRendered( function() {
	/*controle dos menús*/
	$('#home').removeClass('active');
	$('#notifications').removeClass('active');
	$('#administration').removeClass('active');
	$('#report').addClass('active');

	$('#homecell').removeClass('active');
	$('#notificationscell').removeClass('active');
	$('#reportcell').addClass('active');
	$('#administrationcell').removeClass('active');
	$('#mastercompanycell').removeClass('active');
	$('#companycell').removeClass('active');
	$('#userscell').removeClass('active');
	$('#machinecell').removeClass('active');
	$('#registermachinecell').removeClass('active');
	$('#eventsmachinecell').removeClass('active');
	$('#devicecell').removeClass('active');

	/*controle da cor de fundo do template*/
	$('body').removeClass('grey darken-4');

	/*inicialização de pluguins*/
	$('.tooltipped').tooltip({delay: 50});
	$('.modal-trigger').leanModal({
		dismissible: false
	});
	$('ul.tabs').tabs();
	$('select').select2();

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
	$('#data-table-report').DataTable( {
		"dom": "<t>",
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

});

Template.report.onDestroyed(function(){
	delete Session.keys['SELECTED_MACHINE'];
	delete Session.keys['SELECTED_TYPE_REPORT'];
	delete Session.keys['START_DATE_FILTER'];
	delete Session.keys['END_DATE_FILTER'];
	delete Session.keys['FILTER_CONFIGURED'];
	// delete Session.keys['NAME_REPORT'];
});