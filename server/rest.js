// //================================================================================
// //  @file         rest.js
// //  @version      0.0.1
// //  @path         server/
// //  @description  Serviços relacionados ao REST.
// //  @author       MateusDeveloper
// //  @contact      mateus.developer@gmail.com
// //  @copyright    Copyright HydrBytes Technologies Corporation Ltda.
// //================================================================================

//================================================================================
//Hardware Communications Web Service
//================================================================================
Meteor.method("hardwareCommunications", function (cmd)
{
	//Imprime o comando recebido
	console.log("cmd = %s", cmd);
	//Transformo a string CMD em um array de caracteres
	var cmdArray = cmd.split("");

	// //De acordo com o device escolhido, olho na tabela MachineInputs o que devo retornar
	// var machineObj = MachineInputs.findOne({_idMachine: ownerObj._idMachine});

	//Insiro na coleção RawData, que é tratada pelo guardian
	try {
		RawData.insert({
			input: cmd,
			createdat: moment.utc().unix(),
			status: 0,
		});

		// //Preparo o array de teste e o array de retorno
		// var statusArray = [];
		// var returnArray = [];

	 //  var deviceArray = parse('%s%s%s%s', cmdArray[16], cmdArray[17], cmdArray[18], cmdArray[19]);
	 //  deviceArray = deviceArray.split("");       	//Transformo a string deviceArray em um array de caracteres

	 //  //Preencho statusArray com os valores que vieram do REST
	 //  statusArray.push(machineObj.Inputs.emergency);
	 //  statusArray.push(machineObj.Inputs.extLock);
	 //  statusArray.push(machineObj.Inputs.intLock);
	 //  statusArray.push(machineObj.Inputs.lights);

		// //Teste se a resposta e preencho o array de retorno com a fonte necessária
		// for(i = 0; i < 4; i++){
		// 	if(statusArray[i] != deviceArray[i]){
		// 		returnArray[i] = statusArray[i];
		// 	}else{
		// 		returnArray[i] = deviceArray[i];
		// 	}
		// }

	 //  //Formato o array de retorno de acordo com o protocolo
	 //  returnArray = parse('*0%s%s%s%s00@', returnArray[0], returnArray[1], returnArray[2], returnArray[3]);
	 returnArray = "*0000000@";
		return returnArray; //Sucesso
	}
	catch(err) {
		var returnError = "*1000000@";
			return returnError; //Problemas
		}
	},{
		url: "hardware",		//Nome da função a ser usado no CURL
		getArgsFromRequest: function (request) {
		// Configuração do request do REST
		var content = request.body;
		return [ content.cmd ];
	}});


// Meteor.method("hardwareHydroBytesCommunications", function (cmd){
// 	//Insiro na coleção MachineData, que é tratada pelo guardian
// 	try {

// 		console.log(cmd);
// 		console.log(cmd.length);

// 		/*Pega a data deste JSON*/
// 		var startDatetimedata = cmd.indexOf("datetimedata") + 15;
// 		var finishDatetimedata = cmd.indexOf("datetimedata") + 27;
// 		var datetimedata = parseInt(cmd.slice(startDatetimedata, finishDatetimedata));

// 		/*Verifica se Ja existe este Hardware no Banco, se não existir ele cria!*/
// 		var startIdHardware = cmd.indexOf("_idHardware") + 14;
// 		var finishIdHardware = cmd.indexOf("_idHardware") + 18;
// 		var _idHardware = parseInt(cmd.slice(startIdHardware, finishIdHardware));

// 		var startOnOffMachine = cmd.indexOf("onOffMachine") + 15;
// 		var finishOnOffMachine = cmd.indexOf("onOffMachine") + 16;
// 		var onOffMachine = parseInt(cmd.slice(startOnOffMachine, finishOnOffMachine));
// 		console.log(onOffMachine);
// 		console.log("AQUI");

// 		if(Devices.findOne({_idHardware: _idHardware}) != undefined){
// 			console.log('ja tem este hardware');
// 			var lastMachineData = MachineData.findOne({_idHardware: _idHardware}, {sort: {datetimedata: -1}, fields: {_id: 1, onOffMachine: 1} });
// 			console.log(lastMachineData);
// 			if(onOffMachine == lastMachineData.onOffMachine){
// 				console.log('Mesmo estado, faz update!');
// 			}else{
// 				console.log('Novo estado, grava novo!');
// 			}

// 			/*Tratamento do JSON para gravar*/
// 			var startMsg = cmd.indexOf("#")+1;
// 			var finishMsg = cmd.indexOf("?");
// 			var cmdInsertDb = cmd.slice(startMsg, finishMsg);
// 			var jsonInsertDB = EJSON.parse(cmdInsertDb);
// 			console.log(jsonInsertDB);

// 			/*Gravando no Banco o JSON recebido*/
// 			MachineData.insert(jsonInsertDB);
// 			console.log('GRAVEIIIIII');

// 		}else{
// 			console.log('NAO tem este hardware, criando para gravar!');

// 			/*Verifica se Ja existe a Compania deste Hardware no Banco, se não existir ele cria!*/
// 			var startCompanyCode = cmd.indexOf("_companyCode") + 15;
// 			var finishCompanyCode = cmd.indexOf("_companyCode") + 17;
// 			var _companyCode = parseInt(cmd.slice(startCompanyCode, finishCompanyCode));

// 			if(Company.findOne({_companyCode: _companyCode}) != undefined){
// 				console.log('tem empresa');

// 				Devices.insert({
// 					"_idMachine": null,
// 					"_idHardware": _idHardware,
// 					"_companyCode": _companyCode,
// 					"name": "Dispositivo nao associado! - " + _idHardware,
// 					"serialnumber": null,
// 					"operatingsince": datetimedata,
// 					"KeepAlive":{
// 						'timer': datetimedata,
// 						'flag': 0,
// 					},
// 					"info": "Dispositivo de Aquisicao de dados Darphyum",
// 					"status": 0,
// 					"sysstatus": 3,
// 				});

// 				/*Tratamento do JSON para gravar*/
// 				var startMsg = cmd.indexOf("#")+1;
// 				var finishMsg = cmd.indexOf("?");
// 				var cmdInsertDb = cmd.slice(startMsg, finishMsg);
// 				var jsonInsertDB = EJSON.parse(cmdInsertDb);

// 				/*Gravando no Banco o JSON recebido*/
// 				MachineData.insert(jsonInsertDB);
// 				console.log('GRAVEIIIIII');
// 			}else{
// 				console.log('não tem empresa');

// 				Company.insert({
// 					"name": "Empresa nao Cadastrada - Mas com hardware Associado",
// 					"_companyCode": _companyCode,
// 				});

// 				Devices.insert({
// 					"_idMachine": null,
// 					"_idHardware": _idHardware,
// 					"_companyCode": _companyCode,
// 					"name": "Dispositivo nao cadastrado - " + _idHardware,
// 					"serialnumber": null,
// 					"operatingsince": datetimedata,
// 					"KeepAlive":{
// 						'timer': datetimedata,
// 						'flag': 0,
// 					},
// 					"info": "Dispositivo de Aquisicao de dados Darphyum",
// 					"status": 0,
// 					"sysstatus": 3,
// 				});

// 				/*Tratamento do JSON para gravar*/
// 				var startMsg = cmd.indexOf("#")+1;
// 				var finishMsg = cmd.indexOf("?");
// 				var cmdInsertDb = cmd.slice(startMsg, finishMsg);
// 				var jsonInsertDB = EJSON.parse(cmdInsertDb);

// 				/*Gravando no Banco o JSON recebido*/
// 				MachineData.insert(jsonInsertDB);
// 				console.log('GRAVEIIIIII');

// 			}
// 		}

// 		/*Mensagem de Resposta do REST*/
// 		returnArray = "*0000000@";
// 		return returnArray; //Sucesso
// 	}
// 	catch(err) {
// 		var returnError = "*1000000@";
// 			return returnError; //Problemas
// 		}
// 	},{
// 		url: "hardwareHydroBytes",		//Nome da função a ser usado no CURL
// 		getArgsFromRequest: function (request) {
// 		// Configuração do request do REST
// 		var content = request.body;
// 		return [ content.cmd ];
// 	}});


// //================================================================================
// //Tests with Web Service
// //================================================================================

// Meteor.methods({
// 	"return-five": function () {
// 		return 5;
// 	}
// });

// Meteor.method("return-five2", function () {
// 	return 5;
// });

// Meteor.method("add-numbers", function (a, b)
// {
// 	return a + b;
// },{
// 	url: "add-numbers",
// 	getArgsFromRequest: function (request) {
// 		// Let's say we want this function to accept a form-encoded request with
// 		// fields named `a` and `b`.
// 		var content = request.body;

// 		// Since form enconding doesn't distinguish numbers and strings, we need
// 		// to parse it manually
// 		return [ parseInt(content.a, 10), parseInt(content.b, 10) ];
// 	}
// });


// Meteor.method("return-five-auth", function ()
// {
// 	if (this.userId) {
// 		return 5;
// 	} else {
// 		return 0;
// 	}
// });


// Meteor.method("add-arguments-from-url", function (a, b) {
// 	return a + b;
// }, {
// 	url: "/add-arguments-from-url/:a/:b",
// 	getArgsFromRequest: function (request) {
// 		var a = request.params.a;
// 		var b = request.params.b;

// 		return [ parseInt(a, 10), parseInt(b, 10) ];
// 	},
// 	httpMethod: "get"
// });

