install:
	npm install

start:
	npx babel-node ./dist/bin/main.js
		
publish:
	npm publish --dry-run
	
lint:
	npx eslint ./src