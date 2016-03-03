//================================================================================
//  @file         handlebarsRegisterHelper.js
//  @version      0.0.1
//  @path         client/_controllers/_bin
//  @description  Assinaturas para Métodos Handlebars.
//  @author       MateusDeveloper
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

if (Meteor.isClient) {

	Handlebars.registerHelper("printStatusString", function(owner){
		var status;
		switch (owner){
			case 0:
			status = "PARADO";
			break;
			case 1:
			status = "EM ATIVIDADE";
			break;
			case 2:
			status = "EMERGÊNCIA";
			break;
			case 3:
			status = "FALTA DE ENERGIA";
			break;
			default:
			status = "ERRO";
			break;
		}
		return status;
	});

	Handlebars.registerHelper("printSysStatusString", function(owner){
		var status;
		switch (owner){
			case 0:
			status = "INATIVO";
			break;
			case 1:
			status = "ATIVO";
			break;
			case 2:
			status = "MANUTENÇÃO";
			break;
			case 3:
			status = "NÃO ASSOCIADO";
			break;
			default:
			status = "ERRO";
			break;
		}
		return status;
	});

	Handlebars.registerHelper("printStatusColor", function(owner) {
		var status;
		switch (owner){
			case 0:
			color = "badge grey";
			break;
			case 1:
			color = "badge green darken-4";
			break;
			case 2:
			color = "badge red darken-4";
			break;
			case 3:
			color = "badge amber accent-4";
			break;
			default:
			color = "gray";
			break;  case 0:
		}
		return color;
	});

	Handlebars.registerHelper("printSysStatusColor", function(owner) {
		var status;
		switch (owner){
			case 0:
			color = "badge grey";
			break;
			case 1:
			color = "badge green darken-4";
			break;
			case 2:
			color = "badge amber accent-4";
			break;
			case 3:
			color = "badge grey lighten-1";
			break;
			default:
			color = "gray";
			break;  case 0:
		}
		return color;
	});

	Handlebars.registerHelper('selected', function(valueone, valuetwo) {
		return valueone == valuetwo ? 'selected' : '';
	});

	Handlebars.registerHelper('checked', function(valueone, valuetwo) {
		return valueone == valuetwo ? 'checked' : '';
	});

	Handlebars.registerHelper('lastOf', function(array) {
		return array[array.length-1];
	});
}