//================================================================================
//  @file         coHeader.js
//  @version      0.0.1
//  @path         client/_controllers/
//  @description  CONTROLLER para Header/Navegação/Menu.
//  @author       MateusDeveloper
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

if (Meteor.isClient) {

  function keydown(e) {

    var ctrlKeyDown = true;

    if ((e.which || e.keyCode) == 116 || ((e.which || e.keyCode) == 116 && ctrlKeyDown)) {
        // Pressing F5 or Ctrl+R
        e.preventDefault();
      } else if ((e.which || e.keyCode) == 17) {
        // Pressing  only Ctrl
        ctrlKeyDown = true;
      }
    };

    function keyup(e){

      var ctrlKeyDown = true;
    // Key up Ctrl
    if ((e.which || e.keyCode) == 17)
      ctrlKeyDown = false;
  };

//********************************************************************************
// Helpers
//********************************************************************************
Template.header.helpers({
  'getCompanyName': function(userObj){
    if(userObj._idMasterCompany == undefined){
      return Company.findOne({_id: userObj._idCompany}).name;
    }else{
      return MasterCompany.findOne({_id: userObj._idMasterCompany}).name;
    }
  },
});


Template.sysInfoModal.helpers({
  'getIdSystem': function(){
    return System.findOne();
  },

  'getInfoCompany': function(){
    var thisUser = Meteor.user(); //retorna o objeto do usuário logado.
    var company  = Company.findOne({_id: thisUser._idCompany});
    return company;
  },

  'getInfoMasterCompany': function(){
    var thisUser      = Meteor.user(); //retorna o objeto do usuário logado.
    var masterCompany = MasterCompany.findOne({_id : thisUser._idMasterCompany});
    return masterCompany;
  },

  'formatDate': function(datetime){
    if(datetime == undefined){
      return "Data Inválida!";
    }else{
      var resultFormat = moment(datetime, 'X').format('DD/MM/YYYY');
      return resultFormat;
    }
  },
});


//********************************************************************************
// Events
//********************************************************************************
Template.exit.events({
  'click #confirmExit':function(event, template){
    event.preventDefault();
    Meteor.logout(function(err) {
    });
    /*precisa ser nesta ordem, pois senão não desloga ele da o router e demora a deslogar por timeOut*/
    Router.go('/');
  },
});

//********************************************************************************
// Lifecycle Hook
//********************************************************************************
Template.header.onCreated( function() {
  Session.set('pageTitle', 'Minha App')
});

Template.sysInfoModal.onRendered(function() {
 $('.tooltipped').tooltip({delay: 50});
 $('ul.tabs').tabs();
});

Template.header.onRendered(function() {
  $(document).on("keydown", keydown);
  $(document).on("keyup", keyup);

  /*inicialização de pluguins*/
  $('.tooltipped').tooltip({delay: 50});
  $(".dropdown-button").dropdown({
    hover: false,
    constrain_width: false,
  });
  $('.collapsible').collapsible();
  $('.button-collapse').sideNav({
    menuWidth: 450,
  });
  $('.menu-sidebar-collapse').sideNav({
    menuWidth: 320, // Default is 240
    edge: 'left', // Choose the horizontal origin
    closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
  });
  $('.header-modal').leanModal({
    dismissible: true
  });
  $('.header-exit').leanModal({
    dismissible: true
  });


  // Fullscreen
  function toggleFullScreen() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||
      (!document.mozFullScreen && !document.webkitIsFullScreen)) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      }
      else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      }
      else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    }
    else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      }
      else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
      else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  $('.toggle-fullscreen').click(function() {
    toggleFullScreen();
  });

});



}