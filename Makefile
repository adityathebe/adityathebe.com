.PHONY: run
run:
	docker container run --rm -it -p 8000:8000 -v $$(pwd):/app -v /app/node_modules gatsby-app

.PHONY: build
build:
	docker image build -t gatsby-app .