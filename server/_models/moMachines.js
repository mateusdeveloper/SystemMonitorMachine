//================================================================================
//  @file         moDevices.js
//  @version      0.0.1
//  @path         server/_models
//  @description  Métodos para manipular a collection "Machines"
//  @author       MateusDeveloper
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright HydrBytes Technologies Corporation Ltda.
//================================================================================

if (Meteor.isServer) {

	Meteor.methods({


		/** insertMachineMtd()
		*
		* @description Método para incluir novo usuário.
		* @param       n/d
		* @return      n/d
		*
		*/
		'insertMachineMtd' : function(machineData){
			try{

				var MachineTypeObj = MachineType.findOne({_id: machineData._idMachineType})

				if((machineData.machinename != '')){
					Machines.insert({
						"_idCompany"	   : machineData._idCompany,
						"_idMachineType" : machineData._idMachineType,
						"name"			   : machineData.machinename,
						"serialnumber" : machineData.serialnumber,
						"info"			   : machineData.info,
						"hourcount"    : 0,
						"status"		   : 0,
						"sysstatus"	   : 3,
						"dashcode"		 : MachineTypeObj.dashcode,
						"Profile": {
							"value" : machineData.profileValue,
							"unit"  : machineData.profileUnit,
							"limit" : machineData.profileLimit,
						},
						"Goals": {
							"description": machineData.goalDescription,
							"value"      : machineData.goalValue,
						},
						"Operators": machineData.Operator,
					});

					var thisList = EventList.findOne();
					var thisMachine = Machines.findOne({serialnumber: machineData.serialnumber});
					EventList.update({_id: thisList._id},
						{ $addToSet: { Machines: thisMachine._id } })

					result = true;

				}else {
					result = false;
				}
			}catch(e){
				console.log(e);
			}
			return result;
		},


		/** updateMachineMtd
		*
		* @description Método para update em usuário.
		* @param       n/d
		* @return      n/d
		**
		*/
		'updateMachineMtd' : function(machineData){
			try{
				if((machineData.machinename != '')){
					Machines.update({_id: machineData._idMachine},{
						$set: {
							"name"			   : machineData.machinename,
							"serialnumber" : machineData.serialnumber,
							"info"			   : machineData.info,
							"Profile": {
								"value" : machineData.profileValue,
								"unit"  : machineData.profileUnit,
								"limit" : machineData.profileLimit,
							},
							"Goals": {
								"description": machineData.goalDescription,
								"value"      : machineData.goalValue,
							},
							"Operators": machineData.Operator,
						},
					});

					result = true;
				}else {
					result = false;
				}
			}catch(e){
				console.log(e);
				result = false;
			}
			return result;
		},


		/*
		** updateStatusMachineMtd()
		*
		* @description Função para atualizar o status de um Device.
		* @param       n/d
		* @return      n/d
		*
		*/
		'updateStatusMachineMtd': function(machineData) {
			try{
				if((machineData !=  '')){
					Machines.update({_id: machineData._id},{
						$set: {
							"sysstatus": parseInt(machineData.sysstatus),
						},
					});
					result = true;
				}else {
					result = false;
				}
			}catch(e){
				console.log(e);
			}
			return result;
		},


		/*
		** updateEmergencyMtd()
		*
		* @description Função para atualizar os parâmetros de emergências de uma Màquina.
		* @param       Parâmetros de Emergência da Máquina: emergency, extLock, intLock, lights. 0 ou 1 Int
		* @return      Sucesso ou Falha
		*
		*/
		'updateEmergencyMtd' : function(StopEmergency){

			try{

				Machines.update({_id: StopEmergency._idMachine},{
					$set: {
						Inputs:{
							'emergency' : StopEmergency.switchEmergencia,
							'extLock'   : StopEmergency.switchTravaExterna,
							'intLock'   : StopEmergency.switchTravaInterna,
							'lights'    : StopEmergency.switchIluminacao,
						},
					}
				});

				if(StopEmergency.switchEmergencia == '1') {
					Machines.update({_id: StopEmergency._idMachine},{
						$set: {
							"status": 2,
						},
					});
				} else{
					Machines.update({_id: StopEmergency._idMachine},{
						$set: {
							"status": 1,
						},
					});
				}
				return true;

			}catch(e){
				console.log(e);
			}
			return false;
		},



		/** deleteMachineMtd
		*
		* @description Função para deletar uma máquina pelo '_id'.
		* @param       n/d
		* @return      mensagem de sucesso/erro
		*
		*/
		'deleteMachineMtd' : function(thisMachine){
			try{
				if(thisMachine != null) {
					/*desassociar o device vinculado se existir associação*/
					var deviceAssociated = Devices.findOne({_idMachine: thisMachine});
					if((deviceAssociated != null)||(deviceAssociated != undefined)){
						Devices.update({_idMachine: deviceAssociated._idMachine},{
							$set: {
								"_idMachine": null,
								"sysstatus": 3,
							},
						});
						Machines.remove({_id: thisMachine});
						Devices.remove({_idMachine: thisMachine});
					}else {
						Machines.remove({_id: thisMachine});
						Devices.remove({_idMachine: thisMachine});
					}

					/*apagando o histórico*/
					var idMachineString = thisMachine.valueOf();
					MachineData.remove({_idMachine: idMachineString});
				}
			}catch(e){
				console.log(e);
			}
		},


	})
}