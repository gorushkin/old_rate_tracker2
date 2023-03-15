dev:
	npm run dev

build:
	docker build -t rate_tracker .

create:
	docker create --name bot \
	--env-file ./.env \
	 rate_tracker

start:
	docker container start bot

destroy:
	docker stop bot ; \
	docker rm bot ; \

run: create start

update: build run
