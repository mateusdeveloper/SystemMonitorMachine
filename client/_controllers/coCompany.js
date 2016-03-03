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
Template.company.helpers({
  'getCompany': function(){
    return Company.find({}, {sort: {name: 1}});
  },
});

Template.formInsertCompany.helpers({
  'getMasterCompany': function(){;
    return MasterCompany.find({ "Contact.email": { $not: "god@system.com"}}).fetch();
  },

});

Template.formUpdateCompany.helpers({
  'getCompany': function(){
    var thisCompany = Session.get('selectedCompany');
    return Company.findOne(thisCompany);
  },

  'getMasterCompany': function(){
    return MasterCompany.find().fetch();
  },

  'selectedForMasterCompany': function(_idMasterCompany){
    var thisCompany = Session.get('selectedCompany');
    var companyObj = Company.findOne({_id: thisCompany});
    if(companyObj._idMasterCompany.toString() == _idMasterCompany.toString()){
      return 'selected';
    }else {
      return '';
    }
  },

});


Template.deleteCompanyModal.helpers({
  'getCompany': function(){
    var thisCompany = Session.get('selectedCompany');
    return Company.findOne(thisCompany);
  },

});



//********************************************************************************
// Events
//********************************************************************************
Template.company.events({
  'click .update-company-button': function(){
    var companyId = this._id;
    Session.set('selectedCompany', companyId);
    Router.go('/formUpdateCompany');
  },

  'click .company-delete-button': function(){
    var thisCompany = this._id;
    Session.set('selectedCompany', thisCompany);
  },
});


Template.formInsertCompany.events({
  'submit #insert-company-form':function(event, template){
    event.preventDefault();
    var userObj = Meteor.user();

    if(Roles.userIsInRole(userObj, 'God')){
      var mymaster = template.find('#select-mastercompany').value;
      mymaster = removeObject(mymaster);
    }else{
      var mymaster = userObj._idMasterCompany;
    }

    var newCompany = {
      name    : template.find('#name').value,
      cnpj    : template.find('#cnpj').value,
      contact : template.find('#contact').value,
      phone   : template.find('#phone').value,
      email   : template.find('#email').value,
      street  : template.find('#street').value,
      city    : template.find('#city').value,
      state   : template.find('#state').value,
      zipcode : template.find('#zipcode').value,
      master  : mymaster,
    }

    var validationObject = Shower.insertCompanyForm.validate(newCompany);

    if(validationObject.errors == 0){
      Meteor.call('insertCompanyMtd', newCompany, function(error, result){
        if(result == true){
          template.find('#insert-company-form').reset();
          Materialize.toast('Empresa ' + '(' + newCompany.name + ')' + ' inserida com sucesso!', 3000);
          Router.go('company');
        }else{
          Materialize.toast('Erro ao inserir nova Empresa! Tente novamente!', 3000);
        }
      });
    }else {

    }
  }
});


Template.formUpdateCompany.events({
  'submit #update-company-form':function(event, template){
    event.preventDefault();

    /*saber que tipo de usuário*/
    var userObj = Meteor.user();
    //Se é Deus
    if(Roles.userIsInRole(userObj, 'God')){
      if(template.find('#select-mastercompany').value != ""){
        var mCompanyObj = template.find('#select-mastercompany').value;
        var myCompanyId = removeObject(mCompanyObj);
      }else{
        var myCompanyId = null;
      }
    } else {
      //Se não é deus
      var myCompanyIdObj = userObj._idMasterCompany.toString();
      var myCompanyId = removeObject(myCompanyIdObj);
    }

    var companyData = {
      _idCompany      : Session.get('selectedCompany'),
      _idMasterCompany: myCompanyId,
      name            : template.find('#name').value,
      cnpj            : template.find('#cnpj').value,
      contact         : template.find('#contact').value,
      phone           : template.find('#phone').value,
      email           : template.find('#email').value,
      street          : template.find('#street').value,
      city            : template.find('#city').value,
      state           : template.find('#state').value,
      zipcode         : template.find('#zipcode').value,
    }

    var validationObject = Shower.updateCompanyForm.validate(companyData);

    if(validationObject.errors == 0){
      Meteor.call('updateCompanyMtd', companyData, function(error, result){
        if(result == true){
          template.find('#update-company-form').reset();
          Materialize.toast('Empresa ' + '(' + companyData.name + ')' + ' atualizada com sucesso!', 3000);
          Router.go('company');
        }else{
          Materialize.toast('Erro ao atualizar Empresa! Tente novamente!', 3000);
        }
      });
    }else{

    }

  }
});


Template.deleteCompanyModal.events({
  'click #confirmDelete':function(event, template){
    var thisCompany    = Session.get('selectedCompany');
    var companyId      = Company.findOne({_id : thisCompany});
    var masterCompanyId = companyId._idMasterCompany;

    if (Meteor.call('deleteCompanyMtd', thisCompany, masterCompanyId)) {
      Materialize.toast('Erro ao excluir! Tente novamente.', 3000);
    } else {
      Materialize.toast('Empresa excluída com sucesso!', 3000);
    }
  },

});



//********************************************************************************
// Lifecycle Hook
//********************************************************************************
Template.company.onRendered( function() {
  /*controle dos menús*/
  $('#home').removeClass('active');
  $('#notifications').removeClass('active');
  $('#administration').addClass('active');
  $('#report').removeClass('active');

  $('#mastercompany').removeClass('active');
  $('#company').addClass('active');
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
  $('#mastercompanycell').removeClass('active');
  $('#companycell').addClass('active');
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

  $('#data-table-company').DataTable( {
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


Template.formInsertCompany.onRendered( function() {
  /*inicialização de mascaras para inputs*/
  $('#cnpj').mask('00.000.000/0000-00')
  $('#zipcode').mask('00000-000')
  $('#phone').mask('(00) 0000-00000')

  /*inicialização de pluguins*/
  $('.tooltipped').tooltip({delay: 50});
  $('select').select2();
});


Template.formUpdateCompany.onRendered( function() {
  /*inicialização de mascaras para inputs*/
  $('#cnpj').mask('00.000.000/0000-00')
  $('#zipcode').mask('00000-000')
  $('#phone').mask('(00) 0000-00000')

  /*inicialização de pluguins*/
  $('.tooltipped').tooltip({delay: 50});
  $('select').select2();
});



}