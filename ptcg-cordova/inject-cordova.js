"use strict";

(function () {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, './www/index.html');

var replacement = `
<script>
      window.addEventListener = function () {
        EventTarget.prototype.addEventListener.apply(this, arguments);
      };
      window.removeEventListener = function () {
        EventTarget.prototype.removeEventListener.apply(this, arguments);
      };
      document.addEventListener = function () {
        EventTarget.prototype.addEventListener.apply(this, arguments);
      };
      document.removeEventListener = function () {
        EventTarget.prototype.removeEventListener.apply(this, arguments);
      };
</script>
<script src="cordova.js"></script>
`;
    
    fs.readFile(filePath, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(/<\/body>/g, replacement + '</body>');

        fs.writeFile(filePath, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });

}());
