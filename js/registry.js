//this will be the script registry, thus loading everything that is required
define([
		//CONTROLLERS
		'controllers/Header.Controllers',
		'controllers/Home.Controllers',
		//DIRECTIVES
		'directives/EqualiseHeights.Directive',
		//SERVICES
		'services/Accounts.Service',
		'services/Sessions.Service',
		'services/Users.Service',
	], function(){

		return true;

	}
)