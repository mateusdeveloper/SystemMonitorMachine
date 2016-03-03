//================================================================================
//  @file         coOperator.js
//  @version      0.0.1
//  @path         client/_controllers/
//  @description  CONTROLLER para Operator.
//  @author       MateusDeveloperi
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

if (Meteor.isClient) {

//********************************************************************************
// Helpers
//********************************************************************************
Template.operator.helpers({
	'formatDateChart': function(datetime){
		if(datetime == undefined){
			return "Data Inválida!";
		}else{
			var resultFormat = moment(datetime, 'X').format('DD/MM - HH:mm');
			return resultFormat;
		}
	},

	'getMachine': function(){
		var thisMachine = Session.get('selectedMachine');
		return Machines.findOne(thisMachine);
	},

	'getMachineEvent': function(){
		var thisMachine = Session.get('selectedMachine');
		var now = moment.utc().unix();
		var before = now - 86400;

		return TimelineEvents.find({_idMachine:thisMachine, datetimeevent:{$gt: before,$lt: now}}, {sort: {datetimeevent:-1}});
	},

	'getColor': function(eventTypeId){
		var thisType = EventType.findOne({_id: eventTypeId});
		var color = thisType.color;
		//Busca as informações no banco
		return color;
	},

	'getIcon': function(eventTypeId){
		var thisType = EventType.findOne({_id: eventTypeId});
		var icon = thisType.icon;
		//Busca as informações no banco
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

	'getDeviceData': function(){
		var thisMachineId = Session.get('selectedMachine');

		return MachineData.findOne({_idMachine : thisMachineId}, {sort : {datetimedata : -1}});
	},

	'getUpdatedAt': function(){
		var thisMachineId = Session.get('selectedMachine');
		//Testa se existe MachineData
		if((MachineData.find({_idMachine: thisMachienId}).count()) > 1){
			var date = MachineData.findOne({_idMachine : thisMachineId}, {sort : {datetimedata : -1}}).datetimedata;
			var resultFormatDate = moment(date[date.length -1], 'X').format('HH:mm - DD/MM/YYYY');
			return resultFormatDate;
		}else{
			return ' não disponível.'
		}
	},

	'getTimeMachineRunning': function(){
		//Acha a Maquina, Device, DeviceData
		var thisMachineId = Session.get('selectedMachine');
		var lastMachineData = MachineData.findOne({_idMachine: thisMachineId}, {sort: {datetimedata: -1}});
		var timeRunning = (lastMachineData.datetimedata[lastMachineData.datetimedata.length - 1] - lastMachineData.datetimedata[0]);

		//Formata entre horas e minutos
		if(timeRunning<60){
			return "";
		}else	if(timeRunning > 3600){
			return " à " + moment.duration(timeRunning, 'seconds').get('hours') + " H";
		}else{
			return " à " + moment.duration(timeRunning, 'seconds').get('minutes') + " m";
		}
	},

	// 'getTimeMachineRunning': function(){
	// 	//Acha a Maquina, Device, DeviceData
	// 	var thisMachineId = Session.get('selectedMachine');
	// 	var thisDeviceId = Devices.findOne({_idMachine : thisMachineId});
	// 	var thisDeviceDataId = DeviceData.findOne({_idDevice : thisDeviceId._id});
	// 	//Pega o ultimo estado On
	// 	var lastOn  = DeviceData.findOne({_idDevice : thisDeviceId._id, 'Status.running' : 1}, {sort: {datetimedata : -1}});
	// 	//Pega o ultimo estado Off
	// 	var lastOff = DeviceData.findOne({_idDevice : thisDeviceId._id, 'Status.running' : 0}, {sort: {datetimedata : -1}});

	// 	//Se nenhum é indefinido
	// 	if((lastOn !== undefined) && (lastOff !== undefined)){
	// 		//Ve se o último estado é ligado ou desligado
	// 		if(lastOn.datetimedata > lastOff.datetimedata){
	// 			//Diferença de tempo entre os dois ultimos registros;
	// 			var variavel = lastOn.datetimedata - lastOff.datetimedata;

	// 			//Formata entre horas e minutos
	// 			if(variavel<60){
	// 				return "";
	// 			}else	if(variavel > 3600){
	// 				return " à " + moment.duration(variavel, 'seconds').get('hours') + " H";
	// 			}else{
	// 				var texto = " min ";
	// 				return " à " + moment.duration(variavel, 'seconds').get('minutes') + " m";
	// 			}
	// 		}else{

	// 			var variavel = lastOff.datetimedata - lastOn.datetimedata;

	// 			if(variavel > 3600){
	// 				variavel = moment.duration(variavel, 'seconds').as('hours');
	// 				variavel = variavel.toFixed(1).split('.');
	// 				variavel[0] = variavel[0] + " h";
	// 			}else{
	// 				variavel = moment.duration(variavel, 'seconds').as('minutes');
	// 				variavel = variavel.toFixed(1).split('.');
	// 				variavel[0] = variavel[0] + " min";
	// 			}

	// 			return variavel[0];
	// 		}
	// 	}else{
	// 		return "";
	// 	}
	// },

	'formatDate': function(datetime){
		if(datetime == undefined){
			return "Data Inválida!";
		}else{
			var resultFormat = moment(datetime, 'X').format('DD/MM - HH:mm');
			return resultFormat;
		}
	},

});


//********************************************************************************
// Events
//********************************************************************************
Template.operator.events({

});

//********************************************************************************
// Lifecycle Hook
//********************************************************************************
Template.operator.onCreated( function() {

});

Template.operator.onRendered( function() {

	/*controle dos menús*/
	$('#home').addClass('active');
	$('#homecell').addClass('active');

	/*controle da cor de fundo do template*/
	$('body').removeClass('grey darken-4');

	/*inicialização de pluguins*/
	$('.tooltipped').tooltip({delay: 50});
	$('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });

	$('.modal-trigger').leanModal({
		dismissible: false
	});

	$('ul.tabs').tabs();

	$('select').select2();

});

Template.operator.onDestroyed( function() {});

}