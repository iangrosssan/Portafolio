module.exports = function (eleventyConfig) {
    // Pass-through copy: static assets copied as-is to _site/
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/repo-viewer.html");
    eleventyConfig.addPassthroughCopy("src/robots.txt");

    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
            data: "_data"
        },
        templateFormats: ["njk", "md"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
        pathPrefix: process.env.GITHUB_ACTIONS ? "/Portafolio/" : "/"
    };
};
