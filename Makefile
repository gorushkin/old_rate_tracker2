dev:
	npm run dev

build:
	npm run build

start:
	npm run start

d-build:
	docker build -t rate_tracker .

d-run:
	docker create \
	--env-file ./.env \
	 rate_tracker

d-create:
	docker create --name bot \
	--env-file ./.env \
	 rate_tracker

d-start:
	docker container start bot
