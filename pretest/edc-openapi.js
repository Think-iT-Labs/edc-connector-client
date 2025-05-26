const fs = require(`fs/promises`);

const folder = "node_modules";

const CONTEXTS = [
  {
    name: "management-api",
    resourceUrl: "https://eclipse-edc.github.io/Connector/openapi/management-api/management-api.yaml"
  },
  {
    name: "identity-api",
    resourceUrl: "https://eclipse-edc.github.io/IdentityHub/openapi/identity-api/identity-api.yaml"
  },
  {
    name: "presentation-api",
    resourceUrl: "https://eclipse-edc.github.io/IdentityHub/openapi/presentation-api/presentation-api.yaml"
  }
]

Promise.all(CONTEXTS.map((context) =>
  fetch(context.resourceUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to download ${context.name} openapi spec`);
      }
      return response.text()
    })
    .then(text => fs.writeFile(`${folder}/${context.name}.yml`, text))
    .catch(error => {
      console.error(`Error downloading openapi specs for ${context.name}:`, error);
    })))
