//================================================================================
//  @file         router.js
//  @version      0.0.1
//  @path         lib/
//  @description  Parâmetros do pluguin iron:router que define as rotas do sistema.
//  @author       MateusDeveloper
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

Router.configure({
	layoutTemplate: 'layoutDefault'
});

Router.map(function(){
	/*Start-Login*/
	Router.route('/', function () {
		this.layout('layoutLogin');
		this.render('signIn');
	});

	Router.route('/signIn', function () {
		this.layout('layoutLogin');
		this.render('signIn');
	});

	Router.route('/reset-password', function () {
		this.layout('layoutLogin');
		this.render('resetPassword');
	});

	Router.route('/reset-password/:token', function () {
		this.layout('layoutLogin');
		this.render('resetPassword');
		Session.set('RESET_PASSWORD_TOKEN', this.params.token);
	});

	/*Start-Home*/
	Router.route('/home', function () {
		this.layout('layoutDefault');
		this.render('home');
	});

	/*Start-Home-God*/
	Router.route('/home2', function () {
		this.layout('layoutDefault');
		this.render('home2');
	});

	/*Start-Home-God-&&-SysAdm*/
	Router.route('/home3', function () {
		this.layout('layoutDefault');
		this.render('home3');
	});

	/*Start-Administration*/
	Router.route('/machine', function () {
		this.layout('layoutAdmin');
		this.render('machine');
	});

	Router.route('/profileMachine', function () {
		this.layout('layoutAdmin');
		this.render('profileMachine');
	});

	Router.route('/formUpdateProfileMachine', function () {
		this.layout('layoutAdmin');
		this.render('formUpdateProfileMachine');
	});

	Router.route('/formInsertProfileMachine', function () {
		this.layout('layoutAdmin');
		this.render('formInsertProfileMachine');
	});

	Router.route('/eventsMachine', function () {
		this.layout('layoutAdmin');
		this.render('eventsMachine');
	});

	Router.route('/typeMachine', function () {
		this.layout('layoutAdmin');
		this.render('typeMachine');
	});

	Router.route('/formUpdateTypeMachine', function () {
		this.layout('layoutAdmin');
		this.render('formUpdateTypeMachine');
	});

	Router.route('/formInsertTypeMachine', function () {
		this.layout('layoutAdmin');
		this.render('formInsertTypeMachine');
	});

	Router.route('/formInsertMachine', function () {
		this.layout('layoutAdmin');
		this.render('formInsertMachine');
	});

	Router.route('/formUpdateMachine', function () {
		this.layout('layoutAdmin');
		this.render('formUpdateMachine');
	});

	Router.route('/device', function () {
		this.layout('layoutAdmin');
		this.render('device');
	});

	Router.route('/formInsertDevice', function () {
		this.layout('layoutAdmin');
		this.render('formInsertDevice');
	});

	Router.route('/formUpdateDevice', function () {
		this.layout('layoutAdmin');
		this.render('formUpdateDevice');
	});

	Router.route('/user', function () {
		this.layout('layoutAdmin');
		this.render('user');
	});

	Router.route('/formInsertUser', function () {
		this.layout('layoutAdmin');
		this.render('formInsertUser');
	});

	Router.route('/formUpdateUser', function () {
		this.layout('layoutAdmin');
		this.render('formUpdateUser');
	});

	Router.route('/company', function () {
		this.layout('layoutAdmin');
		this.render('company');
	});

	Router.route('/formInsertCompany', function () {
		this.layout('layoutAdmin');
		this.render('formInsertCompany');
	});

	Router.route('/formUpdateCompany', function () {
		this.layout('layoutAdmin');
		this.render('formUpdateCompany');
	});

	Router.route('/mastercompany', function () {
		this.layout('layoutAdmin');
		this.render('mastercompany');
	});

	Router.route('/formInsertMasterCompany', function () {
		this.layout('layoutAdmin');
		this.render('formInsertMasterCompany');
	});

	Router.route('/formUpdateMasterCompany', function () {
		this.layout('layoutAdmin');
		this.render('formUpdateMasterCompany');
	});
	/*End-Administration*/


	Router.route('/report', function () {
		this.layout('layoutDefault');
		this.render('report');
	});

	Router.route("/dashboard0", {
		name: "dashboard0",
		waitOn: function(){
	    //Espera que a subscription esteja completa para renderizar o template
	    return Meteor.subscribe('machinedata', Session.get('selectedMachine'));
	  },
	  action: function () {
	  	if (this.ready() && MachineData.find().count() >= 1) {
	  		this.render('dashboard0');
	  	}
	  	else {
	  		this.render('loading');
	  	}
	  }

	});

	Router.route("/dashboard1", {
		name: "dashboard1",
		waitOn: function(){
	    //Espera que a subscription esteja completa para renderizar o template
	    return Meteor.subscribe('machinedata', Session.get('selectedMachine'));
	  },
	  action: function () {
	  		this.render('dashboard1');
	  }

	});

	Router.route("/dashboard2", {
		name: "dashboard2",
		waitOn: function(){
	    //Espera que a subscription esteja completa para renderizar o template
	    return Meteor.subscribe('newdevicedata', Session.get('selectedMachine'));
	  },
	  action: function () {
	  	if (this.ready() && DeviceData.find().count() > 7) {
	  		this.render('dashboard2');
	  	}
	  	else {
	  		this.render('loading');
	  	}
	  }

	});

	Router.route('/notifications', function () {
		this.layout('layoutDefault');
		this.render('notifications');
	});

	Router.route('/register', function () {
		this.layout('layoutLogin');
		this.render('register');
	});

	Router.route("/operator", {
		name: "operator",
		waitOn: function(){
	    //Espera que a subscription esteja completa para renderizar o template
	    return Meteor.subscribe('machinedata', Session.get('selectedMachine'));
	  },
	  // action: function () {
	  // 	if (this.ready() && DeviceData.find().count() > 7) {
	  // 		this.render('operator');
	  // 	}
	  // 	else {
	  // 		this.render('loading');
	  // 	}
	  //}
	});

	Router.route('/printDashboard', function () {
		this.layout('layoutDefault');
		this.render('printDashboard');
	});
});