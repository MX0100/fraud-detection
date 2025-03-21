module.exports = function (plop) {
    plop.setGenerator("component", {
        description: "Create a new React component",
        prompts: [
            {
                type: "input",
                name: "name",
                message: "Enter component name:",
            },
        ],
        actions: [
            {
                type: "add",
                path: "src/components/{{kebabCase name}}-components/{{pascalCase name}}.tsx",
                templateFile: "plop-templates/component.tsx.hbs",
            },
            {
                type: "add",
                path: "src/components/{{kebabCase name}}-components/{{pascalCase name}}.css",
                template: ".{{camelCase name}} { display: flex; }",
            },
            {
                type: "add",
                path: "src/components/{{kebabCase name}}-components/index.ts",
                template: "export { default } from './{{pascalCase name}}';",
            },
        ],
    });
};
