//================================================================================
//  @file         coUsers.js
//  @version      0.0.1
//  @path         client/_controllers/
//  @description  CONTROLLER para Users.
//  @author       MateusDeveloper
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

if (Meteor.isClient) {
//********************************************************************************
// Helpers
//********************************************************************************
Template.mastercompany.helpers({
  'getMasterCompany': function(){
    return MasterCompany.find({}, {sort: {name: 1}});
  },

  'notOwnMasterCompany': function(thisMasterCompany){
    if(thisMasterCompany.Contact.email == "god@system.com"){
      return false;
    }else{
      return true;
    }
  },
});


Template.formUpdateMasterCompany.helpers({
  'getCompany': function(){
    var thisCompany = Session.get('selectedMasterCompany');
    return MasterCompany.findOne(thisCompany);
  },
});


Template.deleteMasterCompanyModal.helpers({
  'getCompany': function(){
    var thisCompany = Session.get('selectedMasterCompany');
    return MasterCompany.findOne(thisCompany);
  },
});



//********************************************************************************
// Events
//********************************************************************************
Template.mastercompany.events({
  'click .update-master-company-button': function(){
    var companyId = this._id;
    Session.set('selectedMasterCompany', companyId);
    Router.go('/formUpdateMasterCompany');
  },

  'click .master-company-delete-button': function(){
    var thisCompany = this._id;
    Session.set('selectedMasterCompany', thisCompany);
  },
});


Template.formInsertMasterCompany.events({
  'submit #insert-master-company-form':function(event, template){
    event.preventDefault();

    var newMasterCompany = {
      name    : template.find('#name').value,
      cnpj    : template.find('#cnpj').value,
      contact : template.find('#contact').value,
      phone   : template.find('#phone').value,
      email   : template.find('#email').value,
      street  : template.find('#street').value,
      city    : template.find('#city').value,
      state   : template.find('#state').value,
      zipcode : template.find('#zipcode').value,
    }

    var validationObject = Shower.insertMasterCompanyForm.validate(newMasterCompany);

    if(validationObject.errors == 0){
      Meteor.call('insertMasterCompanyMtd', newMasterCompany, function(error, result){
        if(result == true){
          template.find('#insert-master-company-form').reset();
          Materialize.toast('Empresa mae' + '(' + newMasterCompany.name + ')' + ' inserida com sucesso!', 3000);
          Router.go('mastercompany');
        }else{
          Materialize.toast('Erro ao inserir nova Empresa! Tente novamente!', 3000);
        }
      });
    }else{
    }
  }
});


Template.formUpdateMasterCompany.events({
  'submit #update-master-company-form':function(event, template){
    event.preventDefault();

    // var isValid = ValidateForm.validate('#update-company-form');
    // if (!isValid) return;

    var companyData = {
      _idCompany: Session.get('selectedMasterCompany'),
      name      : template.find('#name').value,
      cnpj      : template.find('#cnpj').value,
      contact   : template.find('#contact').value,
      phone     : template.find('#phone').value,
      email     : template.find('#email').value,
      street    : template.find('#street').value,
      city      : template.find('#city').value,
      state     : template.find('#state').value,
      zipcode   : template.find('#zipcode').value,
    }

    var validationObject = Shower.updateMasterCompanyForm.validate(companyData);

    if(validationObject.errors == 0){

      Meteor.call('updateMasterCompanyMtd', companyData, function(error, result){
        if(result == true){
          template.find('#update-master-company-form').reset();
          Materialize.toast('Empresa mae' + '(' + companyData.name + ')' + ' atualizada com sucesso!', 3000);
          Router.go('mastercompany');
        }else{
          Materialize.toast('Erro ao atualizar Empresa! Tente novamente!', 3000);
        }
      });
    }else{
    }
  }
});


Template.deleteMasterCompanyModal.events({
  'click #confirmDelete':function(event, template){
    var thisCompany    = Session.get('selectedMasterCompany');
    var companyId      = Company.findOne({_idMasterCompany : thisCompany}, {fields : {_id : 1}});
    var userCompanyId  = companyId._id;

    if (Meteor.call('deleteMasterCompanyMtd', thisCompany, userCompanyId)) {
      Materialize.toast('Erro ao excluir! Tente novamente.', 3000);
    } else {
      Materialize.toast('Empresa excluída com sucesso!', 3000);
    }
  },

});



//********************************************************************************
// Lifecycle Hook
//********************************************************************************
Template.mastercompany.onRendered( function() {
  /*controle dos menús*/
  $('#home').removeClass('active');
  $('#notifications').removeClass('active');
  $('#administration').addClass('active');
  $('#report').removeClass('active');

  $('#mastercompany').addClass('active');
  $('#company').removeClass('active');
  $('#users').removeClass('active');
  $('#dropdownmachine').removeClass('active');
  $('#admmachine').removeClass('active');
  $('#machine').removeClass('active');
  $('#typemachine').removeClass('active');
  $('#registermachine').removeClass('active');
  $('#eventsmachine').removeClass('active');
  $('#device').removeClass('active');

  $('#homecell').removeClass('active');
  $('#notificationscell').removeClass('active');
  $('#reportcell').removeClass('active');
  $('#dropdownmachinecell').removeClass('active');
  $('#administrationcell').addClass('active');
  $('#mastercompanycell').addClass('active');
  $('#companycell').removeClass('active');
  $('#userscell').removeClass('active');
  $('#admmachinecell').removeClass('active');
  $('#machinecell').removeClass('active');
  $('#typemachinecell').removeClass('active');
  $('#registermachinecell').removeClass('active');
  $('#eventsmachinecell').removeClass('active');
  $('#devicecell').removeClass('active');

  /*controle da cor de fundo do template*/
  $('body').removeClass('grey darken-4');

  /*controle do layout do template*/
  $('#main').addClass('main-administration');
  $('#footer').addClass('main-administration');

  /*inicialização de pluguins*/
  $('.tooltipped').tooltip({delay: 50});
  $('.modal-trigger').leanModal({
    dismissible: true
  });
  $('ul.tabs').tabs();

  $('#data-table-mastercompany').DataTable( {
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

  var table = $('#data-table-row-grouping').DataTable({
    "columnDefs": [
    { "visible": false, "targets": 2 }
    ],
    "order": [[ 2, 'asc' ]],
    "displayLength": 25,
    "drawCallback": function ( settings ) {
      var api = this.api();
      var rows = api.rows( {page:'current'} ).nodes();
      var last=null;

      api.column(2, {page:'current'} ).data().each( function ( group, i ) {
        if ( last !== group ) {
          $(rows).eq( i ).before(
            '<tr class="group"><td colspan="5">'+group+'</td></tr>'
            );

          last = group;
        }
      } );
    }
  });

  $('#data-table-row-grouping tbody').on( 'click', 'tr.group', function () {
    var currentOrder = table.order()[0];
    if ( currentOrder[0] === 2 && currentOrder[1] === 'asc' ) {
      table.order( [ 2, 'desc' ] ).draw();
    }
    else {
      table.order( [ 2, 'asc' ] ).draw();
    }
  } );

  $('select').material_select();

});


Template.formInsertMasterCompany.onRendered( function() {
  $('.tooltipped').tooltip({delay: 50});
  $('#cnpj').mask('00.000.000/0000-00')
  $('#zipcode').mask('00000-000')
  $('#phone').mask('(00) 0000-00000')
});


Template.formUpdateMasterCompany.onRendered( function() {
  $('.tooltipped').tooltip({delay: 50});
  $('#cnpj').mask('00.000.000/0000-00')
  $('#zipcode').mask('00000-000')
  $('#phone').mask('(00) 0000-00000')
});



}