var installer = require('package-script');

installer.init({
	log: false
});

installer.spawn([
	{
		admin: true,
		command: "npm",
		args: ["install", "-g", "grunt-cli"]
	},
	{
		admin: true,
		command: "npm",
		args: ["install", "-g", "bower"]
	},
	{
		admin: true,
		command: "npm",
		args: ["install", "-g", "requirejs"]
	}
]);