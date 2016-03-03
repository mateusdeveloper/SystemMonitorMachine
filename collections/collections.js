//================================================================================
//  @file         collections.js
//  @version      0.0.1
//  @path         collections/
//  @description  Cria as instâncias das Collections dentro da aplicação.
//  @author       MateusDeveloper
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

Devices       			= new Mongo.Collection("Devices", {idGeneration: 'MONGO'});
DeviceData	   			= new Mongo.Collection("DeviceData", {idGeneration: 'MONGO'});
Machines  					= new Mongo.Collection("Machines", {idGeneration: 'MONGO'});
MachineData					= new Mongo.Collection("MachineData", {idGeneration: 'MONGO'});
MachineType 				= new Mongo.Collection("MachineType", {idGeneration: 'MONGO'});
Company       			= new Mongo.Collection("Company", {idGeneration: 'MONGO'});
TimelineEvents		  = new Mongo.Collection("TimelineEvents", {idGeneration: 'MONGO'});
EventList						= new Mongo.Collection("EventList", {idGeneration: 'MONGO'});
EventType						= new Mongo.Collection("EventType", {idGeneration: 'MONGO'});
System   						= new Mongo.Collection("System", {idGeneration: 'MONGO'});
LogSystem  					= new Mongo.Collection("LogSystem", {idGeneration: 'MONGO'});
RawData	  					= new Mongo.Collection("RawData", {idGeneration: 'MONGO'});
MasterCompany	  		= new Mongo.Collection("MasterCompany", {idGeneration: 'MONGO'});
DailyReport		  		= new Mongo.Collection("DailyReport", {idGeneration: 'MONGO'});
