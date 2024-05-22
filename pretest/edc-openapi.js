const fs = require('fs/promises');

const folder = "node_modules";

fs.readFile("connector/gradle/libs.versions.toml")
  .then(versions => {
    const edcRow = versions.toString().split('\n').filter(row => row.startsWith("edc = "))[0];
    return edcRow.substring(7, edcRow.length - 1)
  })
  .then(edcVersion => {
    const context = "management-api";
    const resourceUrl = `https://eclipse-edc.github.io/Connector/openapi/${context}/${edcVersion}/${context}.yaml`;

    return fetch(resourceUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to download ${context} openapi spec`);
        }
        return response.text()
      })
      .then(text => text
        .replaceAll("example: null", "")
        .replaceAll("https://w3id.org/edc/v0.0.1/ns/value", "value")) // to make "secrets" test working, will be fixed in the future
      .then(text => fs.writeFile(`${folder}/${context}.yml`, text));
  })
  .catch(error => {
    console.error('Error downloading openapi specs:', error);
  })
