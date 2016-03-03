//================================================================================
//  @file         moDevices.js
//  @version      0.0.1
//  @path         server/_models
//  @description  Métodos para manipular a collection "Devices"
//  @author       MateusDeveloper
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright HydrBytes Technologies Corporation Ltda.
//================================================================================

if (Meteor.isServer) {
	Meteor.methods({

		/** insertDevices()
		*
		* @description Função para criar um device.
		* @param       n/d
	 	* @return      n/d
	 	*
	 	*/
	 	'insertDeviceMtd': function(newDevice) {
	 		try{
	 			if((newDevice.name != '')){
	 				var deviceId = new Mongo.ObjectID(newDevice._id);
	 				var associatedMachine = new Mongo.ObjectID(newDevice._idMachine);

	 				Devices.update({_id: deviceId},{
	 					$set: {
	 						"_idMachine"     : associatedMachine,
	 						"name"           : newDevice.name,
	 						"serialnumber"   : newDevice.serialnumber,
	 						"operatingsince" : moment.utc().unix(),
	 						"KeepAlive": {
	 							"timer" : moment.utc().unix(),
	 							"flag" : 0,
	 						},
	 						"info"           : newDevice.info,
	 						"status"			   : 0,
	 						"sysstatus"			 : 1
	 					},
	 				});

	 				if(newDevice._idMachine != ''){
	 					Machines.update({_id: associatedMachine},{
	 						$set: {
	 							"sysstatus": 1,
	 						},
	 					});

	 				} else{

	 				}
	 				result = true;
	 			}else {
	 				result = false;
	 			}
	 		}catch(e){
	 			console.log(e);
	 		}
	 		return result;
	 	},


		/** updateDevices()
		*
		* @description Função para atualizar um device.
		* @param       n/d
	 	* @return      n/d
	 	*
	 	*/
	 	'updateDeviceMtd': function(deviceData) {
	 		try{
	 			if((deviceData.name != '')){
	 				var associatedMachine = new Mongo.ObjectID(deviceData._idMachine);

	 				/*procura a máquina que estava associado anteriormente, e se estava associado*/
	 				var objDeviceUpdate = Devices.findOne({_id: deviceData._id});
	 				var idBeforeAssociatedMachine = Machines.findOne({_id: objDeviceUpdate._idMachine})

	 				if(objDeviceUpdate._idMachine != associatedMachine) {
	 					/*desassocia da máquina anterior*/
	 					Machines.update({_id: objDeviceUpdate._idMachine},{
	 						$set: {
	 							"sysstatus": 3
	 						},
	 					});
	 					/*atualiza o device*/
	 					Devices.update({_id: deviceData._id},{
	 						$set: {
	 							"_idMachine"     : associatedMachine,
	 							"name"           : deviceData.name,
	 							"serialnumber"   : deviceData.serialnumber,
	 							"info"           : deviceData.info,
	 							"sysstatus"      : 1
	 						},
	 					});
	 					/*associa a nova máquina*/
	 					Machines.update({_id: associatedMachine},{
	 						$set: {
	 							"sysstatus": 1
	 						},
	 					});
	 				}else {
	 					Devices.update({_id: deviceData._id},{
	 						$set: {
	 							"_idMachine"     : associatedMachine,
	 							"name"           : deviceData.name,
	 							"serialnumber"   : deviceData.serialnumber,
	 							"info"           : deviceData.info,
	 							"sysstatus"      : 1
	 						},
	 					});

	 					Machines.update({_id: associatedMachine},{
	 						$set: {
	 							"sysstatus": 1,
	 						},
	 					});
	 				}
	 				result = true;
	 			}else {
	 				result = false;
	 			}
	 		}catch(e){
	 			console.log(e);
	 		}
	 		return result;

	 	},


	 	/** updateStatusDevicesMtd()
		*
		* @description Função para atualizar o status de um Device.
		* @param       n/d
	 	* @return      n/d
	 	*
	 	*/
	 	'updateStatusDevicesMtd': function(deviceData) {
	 		try{
	 			if((deviceData !=  '')){
	 				if (deviceData.sysstatus == 3){
	 					var objDeviceUpdate = Devices.findOne({_id: deviceData._id});
	 					/*faz a desassociação da máquina em que estava associado*/
	 					Machines.update({_id: objDeviceUpdate._idMachine},{
	 						$set: {
	 							"status": 0,
	 							"sysstatus": 3,
	 						},
	 					});
	 					/*seta seu status para desassociado*/
	 					Devices.update({_id: deviceData._id},{
	 						$set: {
	 							"_idMachine" : null,
	 							"sysstatus"  : parseInt(deviceData.sysstatus),
	 						},
	 					});
	 				} else {
	 					Devices.update({_id: deviceData._id},{
	 						$set: {
	 							"sysstatus": parseInt(deviceData.sysstatus),
	 						},
	 					});
	 				}

	 				result = true;
	 			}else {
	 				result = false;
	 			}
	 		}catch(e){
	 			console.log(e);
	 		}
	 		return result;
	 	},


		/** deleteDevices()
		*
		* @description Função para deletar um device pelo '_id'.
		* @param       _id
	 	* @return      mensagem de sucesso/erro
	 	*
	 	*/
	 	'deleteDevicesMtd': function(thisDevice) {
	 		try{
	 			if(thisDevice != null){
	 				var objThisDevice = Devices.findOne({_id: thisDevice});
	 				/*dessaciar a máquina se existir*/
	 				if((objThisDevice._idMachine != undefined) || (objThisDevice._idMachine != null)){
	 					Machines.update({_id: objThisDevice._idMachine},{
	 						$set: {
	 							"status": 0,
	 							"sysstatus": 3,
	 						},
	 					});
	 					Devices.remove({_id: thisDevice});
	 					/*Deleta todos os DeviceData do Device excluído.*/
	 					DeviceData.remove({_idDevice: thisDevice});
	 				} else {
	 					Devices.remove({_id: thisDevice});
	 					/*Deleta todos os DeviceData do Device excluído.*/
	 					DeviceData.remove({_idDevice: thisDevice});
	 				}
	 			}
	 		}catch(e){
	 			console.log(e);
	 		}
	 	},


	 });
}