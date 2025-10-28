const jsonld = require('jsonld');

const nodeDocumentLoader = jsonld.documentLoaders.node();

export const customLoader = async (url: string) => {
    if (url == "https://w3id.org/edc/dspace/v0.0.1") {
        return {
            contextUrl: null, // this is for a context via a link header
            document: contextDspace001, // this is the actual document that was loaded
            documentUrl: url // this is the actual context URL after redirects
        };
    }

    return nodeDocumentLoader(url);
};

const contextDspace001 = {
    "@context": {
        "@version": 1.1,
        "edc": "https://w3id.org/edc/v0.0.1/ns/",
        "QuerySpec": {
            "@id": "edc:QuerySpec",
            "@context": {
                "sortOrder": "edc:sortOrder",
                "sortField": "edc:sortField",
                "offset": "edc:offset",
                "limit": "edc:limit",
                "filterExpression": {
                    "@id": "edc:filterExpression",
                    "@container": "@set"
                }
            }
        },
        "Criterion": {
            "@id": "edc:Criterion",
            "@context": {
                "operandLeft": "edc:operandLeft",
                "operator": "edc:operator",
                "operandRight": "edc:operandRight"
            }
        },
        "inForceDate": "edc:inForceDate",
        "id": "edc:id",
        "description": "edc:description",
        "isCatalog": "edc:isCatalog"
    }
}