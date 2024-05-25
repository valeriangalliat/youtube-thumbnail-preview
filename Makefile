VERSION = $(shell jq -r .version manifest.json)

all: youtube-thumbnail-preview-$(VERSION).zip

youtube-thumbnail-preview-$(VERSION).zip:
	zip $@ manifest.json script.js worker.js icon.png
