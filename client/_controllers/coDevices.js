//================================================================================
//  @file         coDevice.js
//  @version      0.0.1
//  @path         client/_controllers/
//  @description  CONTROLLER para Devices.
//  @author       MateusDeveloper
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

if (Meteor.isClient) {

//********************************************************************************
// Helpers
//********************************************************************************
Template.device.helpers({
  'getDevices': function(){
    return Devices.find({}, {sort: {name: 1}});
  },

  'getMachinesDevice': function(machineId){
    if(machineId == undefined){
      return "Não Associado";
    }else{
      var machineObj = Machines.findOne({_id : machineId});
      return  machineObj.name;
    }
  },

  'formatDate': function(datetime){
    if(datetime == undefined){
      return "Data Inválida!";
    }else{
      var resultFormat = moment(datetime, 'X').format('DD/MM/YYYY HH:mm:ss');
      return resultFormat;
    }
  },

  'testSysStatusNotAssociated': function(sysStatusDevice){
    if(sysStatusDevice != 3){
      return true;
    }else {
      return false
    }
  },

});


Template.formInsertDevice.helpers({
	'getDevices': function(){
		var deviceList = Devices.find({sysstatus : 3}).fetch();
		return deviceList;
	},

	'getMachines': function(){
		var machinesList = Machines.find({sysstatus: 3}).fetch();
		return machinesList;
	},

  'getDeviceAdd': function(){
    var thisDeviceId = Session.get('selectedDeviceAdd');
    return Devices.findOne(thisDeviceId);
  },

});


Template.formUpdateDevice.helpers({
  'getDevice': function(){
    var thisDevice = Session.get('SELECTED_DEVICE');
    return Devices.findOne(thisDevice);
  },

  'getDevices': function(){
    var deviceList = Devices.find({sysstatus: 3}).fetch();
    return deviceList;
  },

  'getMachines': function(){
    var thisDevice = Session.get('SELECTED_DEVICE');
    var deviceObj = Devices.findOne({_id: thisDevice});
    var machinesList = Machines.find({$or:[{"_id": deviceObj._idMachine}, {"sysstatus": 3}]}).fetch();
    return machinesList;
  },

  'selectedForDevices': function(_idMachine){
    var thisDevice = Session.get('SELECTED_DEVICE');
    var deviceObj = Devices.findOne({_id:thisDevice});
    if(deviceObj._idMachine.toString() == _idMachine.toString()){
      return 'selected';
    }else {
      return '';
    }
  },

});


Template.deleteDeviceModal.helpers({
  'getMachineAssociatedFind': function(){
    var thisDevice = Session.get('SELECTED_DEVICE');
    if(thisDevice != undefined){
      var deviceObj = Devices.findOne({_id: thisDevice});
      if((deviceObj != undefined)&&(deviceObj._idMachine != undefined)){
        return true;
      }else{
        return false;
      }
    } else {
      return false;
    }
  },

  'getMachineAssociated': function(){
    var thisDevice = Session.get('SELECTED_DEVICE');
    if(thisDevice != undefined){
      var deviceObj = Devices.findOne({_id: thisDevice});
      if((deviceObj != undefined)&&(deviceObj._idMachine != undefined)){
        var machineDeviceAssociated = Machines.findOne({_id: deviceObj._idMachine});
        return machineDeviceAssociated;
      } else {
        return false;
      }
    }else {
      return false;
    }
  },

  'getDevice': function(){
    var thisDevice = Session.get('SELECTED_DEVICE');
    return Devices.findOne(thisDevice);
  },
});


Template.statusDeviceModal.helpers({
  'getDevice': function(){
    var thisDevice = Session.get('SELECTED_DEVICE');
    return Devices.findOne(thisDevice);
  },
});



//********************************************************************************
// Events
//********************************************************************************
Template.device.events({
  'click .update-device-button': function(){
    var deviceId = this._id;
    Session.set('SELECTED_DEVICE', deviceId);
    Router.go('/formUpdateDevice');
  },

  'click .delete-device-button': function(){
    var thisDevice = this._id;
    Session.set('SELECTED_DEVICE', thisDevice);
  },

  'click .uptadestatus-device-button': function(){
    var thisDevice = this._id;
    Session.set('SELECTED_DEVICE', thisDevice);
  },
});


Template.formInsertDevice.events({
  'change #select-device': function(event) {
    Session.set("selectedDeviceAdd", event.currentTarget.value);
  },

  'submit #insert-device-form':function(event, template){
    event.preventDefault();

    var device = template.find('#select-device').value;
    device = removeObject(device);
    var machine = template.find('#select-machine').value;
    machine = removeObject(machine);

    var newDevice = {
     _id            : device,
     _idMachine     : machine,
     name           : template.find('#device-name').value,
     serialnumber   : template.find('#serial-number').value,
     info           : template.find('#info-device').value,
   }

   var validationObject = Shower.insertDeviceForm.validate(newDevice);

   if(validationObject.errors == 0){
     Meteor.call('insertDeviceMtd', newDevice, function(error, result){
       if(result == true){
        template.find('#insert-device-form').reset();
        Materialize.toast('Device ' + '(' + newDevice.name + ')' + ' inserido com sucesso!', 3000);
        Router.go('device');
      }else{
        Materialize.toast('Erro ao inserir novo Device! Tente novamente!', 3000);
      }
    });
   }else{
    return false;
  }

}

});


Template.formUpdateDevice.events({
  'submit #update-device-form':function(event, template){
    event.preventDefault();

    var idmachineobj = template.find('#select-machine').value;
    machine = removeObject(idmachineobj);

    var deviceData = {
      _id            : Session.get('SELECTED_DEVICE'),
      _idMachine     : machine,
      name           : template.find('#device-name').value,
      serialnumber   : template.find('#serial-number').value,
      info           : template.find('#info-device').value,
    }

    var validationObject = Shower.updateDeviceForm.validate(deviceData);

    if(validationObject.errors == 0){
      Meteor.call('updateDeviceMtd', deviceData, function(error, result){
        if(result == true){
          template.find('#update-device-form').reset();
          Materialize.toast('Device ' + '(' + deviceData.name + ')' + ' atualizado com sucesso!', 3000);
          Router.go('device');
        }else{
          Materialize.toast('Erro ao atualizar Device! Tente novamente!', 3000);
        }
      });
    }else{
      return false;
    }

  }

});


Template.deleteDeviceModal.events({
	'click #confirmDelete':function(event, template){
		var thisDevice = Session.get('SELECTED_DEVICE');

     //Envia ao método
     if (Meteor.call('deleteDevicesMtd', thisDevice)) {
     	Materialize.toast('Erro ao excluir! Tente novamente.', 3000);
     } else {
     	Materialize.toast('Device excluído com sucesso!', 3000);
     }
   },
 });


Template.statusDeviceModal.events({
  'click #confirm-update-device-button':function(event, template){
    var thisDevice = Session.get('SELECTED_DEVICE');
    var deviceData = {
      _id    : thisDevice,
      sysstatus : template.find('input:radio[name=sysstatus]:checked').value,
    }

    //Envia ao método
    if (Meteor.call('updateStatusDevicesMtd', deviceData)) {
      Materialize.toast('Erro ao atualizar o Status! Tente novamente.', 3000);
    } else {
      Router.go('device');
      Materialize.toast('Status Atualizado com Sucesso!', 3000);
    }
  },
});



//********************************************************************************
// Lifecycle Hook
//********************************************************************************
Template.device.onRendered( function() {
  /*controle dos menús*/
  $('#home').removeClass('active');
  $('#notifications').removeClass('active');
  $('#administration').addClass('active');
  $('#report').removeClass('active');

  $('#mastercompany').removeClass('active');
  $('#company').removeClass('active');
  $('#users').removeClass('active');
  $('#dropdownmachine').removeClass('active');
  $('#admmachine').removeClass('active');
  $('#machine').removeClass('active');
  $('#typemachine').removeClass('active');
  $('#registermachine').removeClass('active');
  $('#eventsmachine').removeClass('active');
  $('#device').addClass('active');

  $('#homecell').removeClass('active');
  $('#notificationscell').removeClass('active');
  $('#reportcell').removeClass('active');
  $('#dropdownmachinecell').removeClass('active');
  $('#administrationcell').addClass('active');
  $('#mastercompanycell').removeClass('active');
  $('#companycell').removeClass('active');
  $('#userscell').removeClass('active');
  $('#admmachinecell').removeClass('active');
  $('#machinecell').removeClass('active');
  $('#typemachinecell').removeClass('active');
  $('#registermachinecell').removeClass('active');
  $('#eventsmachinecell').removeClass('active');
  $('#devicecell').addClass('active');

  /*controle da cor de fundo do template*/
  $('body').removeClass('grey darken-4');

  /*controle do layout do template*/
  $('#main').addClass('main-administration');
  $('#footer').addClass('main-administration');

  /*inicialização de pluguins*/
  $('.tooltipped').tooltip({delay: 50});
  $('.modal-trigger').leanModal({
    dismissible: false
  });
  $('ul.tabs').tabs();

  $('#data-table-devices').DataTable( {
    "order": [[ 3, "asc" ]],
    "language": {
      "sEmptyTable": "Nenhum registro encontrado",
      "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
      "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
      "sInfoFiltered": "(Filtrados de _MAX_ registros)",
      "sInfoPostFix": "",
      "sInfoThousands": ".",
      "sLengthMenu": "Mostrar _MENU_",
      "sLoadingRecords": "Carregando...",
      "sProcessing": "Processando...",
      "sZeroRecords": "Nenhum registro encontrado",
      "sSearch": "Pesquisar",
      "oPaginate": {
        "sNext": "Próximo",
        "sPrevious": "Anterior",
        "sFirst": "Primeiro",
        "sLast": "Último"
      },
      "oAria": {
        "sSortAscending": ": Ordenar colunas de forma ascendente",
        "sSortDescending": ": Ordenar colunas de forma descendente"
      }
    }
  });

  $('select').material_select();

});


Template.formInsertDevice.onRendered( function() {
	$('select').select2();
  $('.tooltipped').tooltip({delay: 50});

});


Template.formUpdateDevice.onRendered( function() {
	$('select').select2();
  $('.tooltipped').tooltip({delay: 50});
});

}