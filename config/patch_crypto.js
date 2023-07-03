const fs = require("fs");
const f =
  "node_modules/@angular-devkit/build-angular/src/webpack/configs/browser.js";
fs.readFile(f, "utf8", function (err, data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(
    /resolve: {/g,
    `resolve: {fallback: {
        fs: false
      },`
  );
  fs.writeFile(f, result, "utf8", function (err) {
    if (err) return console.log(err);
  });
});
