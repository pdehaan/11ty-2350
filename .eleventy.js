const path = require("node:path");

const del = require("del").sync;
const sass = require("sass");

del("./www");

module.exports = function(eleventyConfig) {
  eleventyConfig.addTemplateFormats("scss");

  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",

    async compile(inputContent, inputPath) {
      const parsed = path.parse(inputPath);
      if (parsed.name.startsWith("_")) {
        return; // () => "";
      }
      const result = sass.compileString(inputContent, {
        loadPaths: [
          parsed.dir || ".",
          this.config.dir.includes
        ]
      });
      return (data) => result.css;
    }
  });

  return {
    dir: {
      input: "src",
      output: "www",
    }
  };
};

/**
  > eleventy

  [11ty] Writing www/index.html from ./src/index.liquid
  [11ty] Writing www/assets/styles/main.css from ./src/assets/styles/main.scss
  [11ty] Wrote 2 files in 0.04 seconds (v1.0.0)
 */

/**
  > eleventy

  [11ty] Problem writing Eleventy templates: (more in DEBUG output)
  [11ty] 1. Having trouble rendering scss template ./src/assets/styles/_callout.scss (via TemplateContentRenderError)
  [11ty] 2. Having trouble compiling template ./src/assets/styles/_callout.scss (via TemplateContentCompileError)
  [11ty] 3. Cannot read properties of undefined (reading 'bind') (via TypeError)
  [11ty] 
  [11ty] Original error stack trace: TypeError: Cannot read properties of undefined (reading 'bind')
  [11ty]     at /private/tmp/11ty-2350/node_modules/@11ty/eleventy/src/Engines/Custom.js:173:35
  [11ty] Wrote 0 files in 0.04 seconds (v1.0.1)
  The terminal process "/bin/zsh '-c', 'npm run build'" terminated with exit code: 1.
 */

