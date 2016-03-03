//================================================================================
//  @file         signatureSubscribe.js
//  @version      0.0.1
//  @path         client/_controllers/_bin
//  @description  Assinatura para os publishs no Server.
//  @author       MateusDeveloper
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

if (Meteor.isClient) {

	// Subscribe - MasterCompany
	Meteor.subscribe('mastercompany');
	// Subscribe - Company
	Meteor.subscribe('company');
	// Subscribe - Machines
	Meteor.subscribe('machines');
	// Subscribe - MachineInputs
	//Meteor.subscribe('machineinputs');
	// Subscribe - Devices
	Meteor.subscribe('devices');
	// Subscribe - Meteor.users
	Meteor.subscribe('users');
	// Subscribe - DeviceData
	//Meteor.subscribe('devicedata');
	// Subscribe - DailyReport
	//Meteor.subscribe('dailyreport');
	// Subscribe - System
	Meteor.subscribe('system');
	// Subscribe - EventList
	Meteor.subscribe('eventlist');
	// Subscribe - EventType
	Meteor.subscribe('eventtype');
	// Subscribe - TimeLineEvents
	Meteor.subscribe('timelineevents');
	// Subscribe - MachineType
	Meteor.subscribe('machinetype');
	// Subscribe - MachineData
	//Meteor.subscribe('machinedata');

}