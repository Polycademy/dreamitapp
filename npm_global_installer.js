require('package-script').spawn([
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