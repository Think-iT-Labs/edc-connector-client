package internal

// InvokeHTTPOperationOptions defines the required parameters to call the 'invokeOperation' method
// of the HTTP Client.
type InvokeHTTPOperationOptions struct {
	// Method defines the HTTP Method that we should use.
	Method string
	// Endpoint defines the HTTP endpoint to call.
	Endpoint string
	// RequestPayload defines the request body of the HTTP call.
	RequestPayload interface{}
	// ResponsePayload defines the response interface that HTTP response should be marshalled to.
	ResponsePayload interface{}
	// ExpectedStatusCode defines the expected status code in the HTTP response.
	ExpectedStatusCode int
}
