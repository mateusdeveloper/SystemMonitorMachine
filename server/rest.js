// //================================================================================
// //  @file         rest.js
// //  @version      0.0.1
// //  @path         server/
// //  @description  Serviços relacionados ao REST.
// //  @author       MateusDeveloper
// //  @contact      mateus.developer@gmail.com
// //  @copyright    Copyright Mateus Cardoso Nunes
// //================================================================================

//================================================================================
//Hardware Communications Web Service
//================================================================================
Meteor.method("hardwareCommunications", function (cmd){
	//Dados inseridos direto na coleção MachineData
	console.log('Novos dados recebidos!');
	try {
		console.log(cmd);
		console.log(cmd.length);

		/*Tratamento do cmd -> JSON*/
		var startMsg = cmd.indexOf("#")+1;
		var finishMsg = cmd.indexOf("?");
		var cmdInsertDb = cmd.slice(startMsg, finishMsg);
		var jsonInsertDB = EJSON.parse(cmdInsertDb);

		/*Pega dados necessários*/
		var datetimedata = jsonInsertDB.datetimedata;
		var _idHardware = jsonInsertDB._idHardware;
		var _idMachine = jsonInsertDB._idMachine;
		var _companyCode = jsonInsertDB._companyCode;
		var _idDocument = jsonInsertDB._idDocument;

		if(_idDocument == 0){
			console.log('Mudança de estado/primeiro envio!');
			if(Devices.findOne({_idHardware: _idHardware}) != undefined){
				console.log('Hardware existente! Inserindo nova entrada...');
				var deviceObj = Devices.findOne({_idHardware: _idHardware});
				var newMachineData = MachineData.insert(jsonInsertDB);
				_idDocument = newMachineData._str;
				_idMachine = deviceObj._idMachine;
			}else{
				if(Company.findOne({_companyCode: _companyCode}) == undefined){
					console.log('Empresa não encontrada! Criando uma nova empresa...');

					var lastCompanyCode = Company.findOne({},{fields: {_companyCode:1}});
					_companyCode = lastCompanyCode._companyCode;

					Company.insert({
						"name": "Empresa nao Cadastrada - Mas com hardware Associado",
						"_companyCode": _companyCode,
					});

				}
				console.log('Hardware novo! Criando um novo Device...');

				Devices.insert({
					"_idMachine": _idMachine,
					"_idHardware": _idHardware,
					"_companyCode": _companyCode,
					"name": "Dispositivo nao associado! - " + _idHardware,
					"serialnumber": null,
					"operatingsince": datetimedata,
					"KeepAlive":{
						'timer': datetimedata,
						'flag': 0,
					},
					"info": "Dispositivo de Aquisicao de dados HydroBytes",
					"status": 0,
					"sysstatus": 3,
				});

			}
		}else{
			console.log('Mesmo estado! Testando se é a mesma máquina...');
			var deviceObj = Devices.findOne({_idHardware: _idHardware});

			if(jsonInsertDB._idMachine == deviceObj._idMachine){
				console.log('Mesma máquina. Updating...');

				var documentId = new Mongo.ObjectID(_idDocument);

				MachineData.update({_id: documentId},{
					$push:{
						"HardwareSignals.InDigs.0.InDig0": {$each: jsonInsertDB.HardwareSignals.InDigs[0].InDig0},
						"HardwareSignals.InDigs.1.InDig1": {$each: jsonInsertDB.HardwareSignals.InDigs[1].InDig1},
						"HardwareSignals.InDigs.2.InDig2": {$each: jsonInsertDB.HardwareSignals.InDigs[2].InDig2},
						"HardwareSignals.InDigs.3.InDig3": {$each: jsonInsertDB.HardwareSignals.InDigs[3].InDig3},
						"HardwareSignals.InPulses.0.InPulse0": {$each: jsonInsertDB.HardwareSignals.InPulses[0].InPulse0},
						"HardwareSignals.InPulses.0.datetime": {$each: jsonInsertDB.HardwareSignals.InPulses[0].datetime},
						"HardwareSignals.InAnls.0.InAnl0": {$each: jsonInsertDB.HardwareSignals.InAnls[0].InAnl0},
						"HardwareSignals.InAnls.0.InAnl1": {$each: jsonInsertDB.HardwareSignals.InAnls[1].InAnl1},
						"HardwareSignals.InAnls.0.InAnl2": {$each: jsonInsertDB.HardwareSignals.InAnls[2].InAnl2},
						"HardwareSignals.InAnls.0.InAnl3": {$each: jsonInsertDB.HardwareSignals.InAnls[3].InAnl3},
						"datetimedata": {$each: jsonInsertDB.datetimedata},
					}
				});

			}else{ //ide
				console.log('Nova máquina. Retornando novo _idLogical e _idDocument 0!');
				_idDocument = 0;
				_idMachine = deviceObj._idMachine;
			}
		}

		/*Resposta do REST*/
		var returnDocument = {"_idDocument": _idDocument, "_idMachine": _idMachine, "ret": 0};
		console.log("Sucesso! Retornando:");
		console.log( returnDocument);
		return returnDocument;

		/*Código para Retorn em String*/
		//var _idDocumentRet = util.format('{"_idDocument": "%s", "_idHardwareLogical": "%s", "ret": "%d"}' , _idDocument, _idHardwareLogical, 0);
		//console.log(_idDocumentRet);
		// return _idDocumentRet;
	}
	catch(err) {
		var returnError = {"ret" : 1};
		return returnError; //Problemas
	}
},{
		url: "hardwareCommunications",		//Nome da função a ser usado no CURL
		getArgsFromRequest: function (request) {
		// Configuração do request do REST
		var content = request.body;
		return [ content.cmd ];
	}});