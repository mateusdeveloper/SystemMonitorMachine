//================================================================================
//  @file         coLogin.js
//  @version      0.0.1
//  @path         client/_controllers/
//  @description  CONTROLLER para Login.
//  @author       MateusDeveloper
//  @contact      mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

if (Meteor.isClient) {

//********************************************************************************
// Helpers
//********************************************************************************
Template.resetPassword.helpers({
  'confirmExit': function(){
    var btnExit = Session.get('RESET_PASSWORD_TOKEN_OK');
    console.log(btnExit);
    return btnExit;
  }
});

//********************************************************************************
// Events
//********************************************************************************
Template.signIn.events({
  'submit #login-form': function(event, template){
    event.preventDefault();
    var email = template.find('#email').value;
    var password = template.find('#password').value;

    Meteor.loginWithPassword(email, password, function(err){
      if (err) {
        Materialize.toast('Erro no login! Tente novamente!', 3000);
      } else {
        var userObj = Meteor.user();
        if(Roles.userIsInRole(userObj, 'SysAdm')){
          if(Roles.userIsInRole(userObj, 'God')){
            Router.go("/home2");
          }else{
            Router.go("/home3");
          }
        }else{
          Router.go("/home");
        }
        Materialize.toast('Bem-vindo! - ' + email, 3000);
      }
    });
    return false;
  }
});


Template.forgotPasswordModal.events({
  'submit #forgot-password-form': function(event, template) {
    event.preventDefault();

    var forgotPasswordForm = $(event.currentTarget),
    email = forgotPasswordForm.find('#forgotmail').val().toLowerCase();

    Accounts.forgotPassword({email: email}, function(error) {
      if(error){
        if (error.message === 'User not found [403]') {
          template.find('#forgot-password-form').reset();
          template.find('#forgotpassoword-close-button').click();
          Materialize.toast('Este e-mail não está cadastrado!', 3000);
        } else {
          template.find('#forgot-password-form').reset();
          template.find('#forgotpassoword-close-button').click();
          Materialize.toast('We are sorry but something went wrong.', 3000);
        }
      }else{
        template.find('#forgot-password-form').reset();
        template.find('#forgotpassoword-close-button').click();
        Materialize.toast('E-mail enviado. Confira o seu e-mail para recuparar a senha.', 3000);
      }
    });
  },
});


Template.resetPassword.events({
  'submit #reset-password-form': function(event, template) {
    event.preventDefault();

    var password = template.find('#password').value;
    var confirmpassword = template.find('#confirmpassword').value;

    if(password == confirmpassword) {
      Accounts.resetPassword(Session.get('RESET_PASSWORD_TOKEN'), password, function (error) {
        if(error){
          template.find('#reset-password-form').reset();
          Materialize.toast('Não foi possível recuperar a senha! Tente novamente mais tarde.', 3000);
          Session.set('RESET_PASSWORD_TOKEN_OK', true);
        }else{
          template.find('#reset-password-form').reset();
          Session.set('RESET_PASSWORD_TOKEN', null);
          Materialize.toast('Senha alterada com sucesso!', 3000);
          Session.set('RESET_PASSWORD_TOKEN_OK', true);
        }
      });
    } else {
      template.find('#reset-password-form').reset();
      Materialize.toast('Senhas não conferem! Tente novamente.', 3000);
    }

  },

  'click #exitForgotPass': function(){
    window.close();
  }
});



//********************************************************************************
// Lifecycle Hook
//********************************************************************************
Template.signIn.onRendered( function() {

  /*controle da cor de fundo do template*/
  $('body').addClass('grey darken-4');

  /*inicialização de pluguins*/
  $(".button-collapse").sideNav();
  $('.tooltipped').tooltip({delay: 50});
  $('.modal-trigger').leanModal({
    dismissible: false,
  });

});


Template.resetPassword.onRendered( function() {

  /*controle da cor de fundo do template*/
  $('body').addClass('grey darken-4');

  /*inicialização de pluguins*/
  $(".button-collapse").sideNav();
  $('.tooltipped').tooltip({delay: 50});
  $('.modal-trigger').leanModal({
    dismissible: false,
  });

});

}