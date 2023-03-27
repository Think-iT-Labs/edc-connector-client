test:
ifeq ($(WHAT),)
	go test -coverprofile=coverage.out ./...
else
	go test -coverprofile=coverage.out $(WHAT)
endif
