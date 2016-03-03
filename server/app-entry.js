//================================================================================
//  @file        	appEntry.js
//  @version     	0.0.1
//  @path        	server/
//  @description  Ao iniciar a ãplicação, o servidor roda este arquivo para
//							 	monitorar e iniciar as tabelas não iniciadas.
//  @author      	MateusDeveloper
//  @contact     	mateus.developer@gmail.com
//  @copyright    Copyright Mateus Cardoso Nunes
//================================================================================

if (Meteor.isServer) {

	Meteor.startup(function () {

		/*customização da mensagem de recuperação de senha*/
		Accounts.emailTemplates.siteName = "SystemMonitorMachine";
		Accounts.emailTemplates.from = "SystemMonitorMachine <support@systemmonitormachine.com>";
		Accounts.emailTemplates.resetPassword.subject = function(user) {
			return "Recuperar senha no SystemMonitorMachine."
		};
		Accounts.emailTemplates.resetPassword.text = function(user, url) {
			var token = url.substring(url.lastIndexOf('/') + 1, url.length);
			var newUrl = Meteor.absoluteUrl('reset-password/' + token);
			var str = 'Olá ' + user.profile.name + ', você está recebendo este e-mail do SystemMonitorMachine! \n\n';
			str+= 'Clique neste link para resetar a sua senha: \n';
			str+= newUrl;
			return str;
		};

		console.log("");
		console.log("###################################### Starting... ######################################");
		console.log("                      SystemMonitorMachine - Mateus Cardoso Nunes                        ");
		console.log("#########################################################################################");
		console.log("");
		initializeCollections();
		guardian();
		dailyreport();

	});

}