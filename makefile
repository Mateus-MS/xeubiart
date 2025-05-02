DEV_DIR = ./dev
BUILD_DIR = ./build
MAKEIGNORE = makeignore

JS_DIR = ./dev/frontend/mobile/src/js
JS_MIN_DIR = ./build/frontend/mobile/src/js

API_URL_DEV = http://localhost:3000
API_URL_PROD = https://cubonauta.com

.PHONY: build reset minify start watch_sass run_air replace_url create_env

all: build

reset: 
	@echo "\033[35mCleaning $(BUILD_DIR)\033[0m"
	@rm -rf $(BUILD_DIR)/*
	@echo "\033[32mCleaning completed.\033[0m"

build: reset
	@echo "\033[35mCopying files from $(DEV_DIR) to $(BUILD_DIR)\033[0m"

	# copy all files from dev to build except those listed in .makeignore
	@rsync -av --exclude-from=$(MAKEIGNORE) $(DEV_DIR)/ $(BUILD_DIR)/
	
	@echo "\033[32mCopy completed.\033[0m"
	@$(MAKE) minify

minify:
	@echo "\033[35mMinifying files in $(BUILD_DIR)\033[0m"

	# Minify all JS files, maintaining directory structure
	@find $(JS_DIR) -type f -name "*.js" -exec sh -c ' \
        for file; do \
            minified_path="$(JS_MIN_DIR)/$${file#$(JS_DIR)/}"; \
            mkdir -p "$$(dirname "$$minified_path")"; \
            terser "$$file" --compress --mangle -o "$$minified_path"; \
        done' _ {} +

	@echo "\033[32mMinify completed.\033[0m"
	
	# Replace localhost with actual API URL
	@$(MAKE) replace_url

replace_url:
	@echo "\033[35mReplacing localhost with actual API URL in all files\033[0m"

	# Find all files inside $(BUILD_DIR) and apply sed replacement
	@find $(BUILD_DIR) -type f -exec sed -i 's|http://localhost:3000|$(API_URL_PROD)|g' {} +

	@echo "\033[32mAPI URL replacement completed.\033[0m"