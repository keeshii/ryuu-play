"use strict";

(function () {
    var fs = require('fs');
    var path = require('path');

var indexPatches = [{
	find: '<meta name="viewport" content="width=device-width, initial-scale=1">',
	replacement: '<meta name="viewport" content="width=device-width, initial-scale=0.65, maximum-scale=0.65, user-scalable=no">'
}, {
	find: '</script></body>',
	replacement: `</script>
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
      document.addEventListener('deviceready', function() {
        if(window.StatusBar) {
          StatusBar.hide();
        }
      }, false);
</script>
</body>`
}];

var mainPatches = [{
	find:
`import org.apache.cordova.*;

public class MainActivity`,
	replacement:
`import org.apache.cordova.*;
import android.webkit.WebSettings; 
import android.webkit.WebView;

public class MainActivity`
}, {
	find: `
        loadUrl(launchUrl);
    }
`,
	replacement: `
        loadUrl(launchUrl);
        // Viewport Settings
        WebView webView = (WebView) appView.getEngine().getView();
        WebSettings settings = webView.getSettings();
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
    }
`
}];

var patches = {
	'./www/index.html': indexPatches,
	'./platforms/android/app/src/main/java/eu/ryuu/ptcg/MainActivity.java': mainPatches
}

function patchFile(fileName, filePatches) {
	var filePath = path.join(__dirname, fileName);

	return new Promise((resolve, reject) => {
		fs.readFile(filePath, 'utf8', function (err,data) {
			if (err) {
				return reject(err);
			}

			let replaced = data;
			for (const patch of filePatches) {
				replaced = replaced.replace(patch.find, patch.replacement);
			}

			if (replaced === data) {
				return resolve();
			}

			fs.writeFile(filePath, replaced, 'utf8', function (err) {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

async function applyPatches() {
	for (const fileName in patches) {		
		await patchFile(fileName, patches[fileName]);
	}
}

applyPatches();

}());
