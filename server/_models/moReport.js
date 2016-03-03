//================================================================================
//  @file         moReport.js
//  @version      0.0.1
//  @path         server/_models
//  @description  Métodos para exportar Relatórios
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

if (Meteor.isServer) {
	Meteor.methods({
		exportCSV: function(objectCSV) {
			var data = [];

			if(objectCSV.type == 'totalizadores'){
				var fields = [
				"Máquina",
				"Data",
				"Utilização Diária (s)",
				"% em Carga",
				"Temperatura Máxima (°C)",
				"Pressão Máxima (bar)"
				];

				var inputs = DailyReport.find({_idMachine: objectCSV.machineId, datetimedata:{$gt: objectCSV.beforeFilter,$lt: objectCSV.afterFilter}},
					{sort: {datetimedata:-1}, limit:1000}).fetch();

				_.each(inputs, function(c) {
					data.push([
						objectCSV.machineName,
						moment.utc(c.datetimedata, 'X').format('DD/MM/YYYY'),
						c.Data.timeon,
						c.Data.load,
						c.Data.maxTemp,
						c.Data.maxPress
						]);
				});

			}else if(objectCSV.type == 'individuais'){
				var fields = [
				"Máquina",
				"Data",
				"Temperatura (°C)",
				"Pressão (bar)"
				];

				var thisDevice = Devices.findOne({_idMachine: machineId}, {fields: {'_id':1}});

				var inputs = DeviceData.find({_idDevice:thisDevice._id, datetimedata:{$gt: beforeFilter,$lt: afterFilter}},
					{sort: {datetimedata:-1}, limit:1000}).fetch();

				_.each(inputs, function(c) {
					data.push([
						objectCSV.machineName,
						moment.utc(c.datetimedata, 'X').format('DD/MM/YYYY - HH:mm:ss'),
						c.Data.temp,
						c.Data.pressure,
						]);
				});
			}



			return {fields: fields, data: data};
		},

	})
}