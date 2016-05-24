
// Load color palette

function loadColors(context, target) {
	
	var app = NSApp.delegate();
	var doc = context.document;
	var inspector = doc.inspectorController();
	var openPanel = NSOpenPanel.openPanel();
	var version = context.plugin.version().UTF8String();
	var fileTypes = [NSArray arrayWithObjects:@"sketchpalette",nil]
	
	// Open file picker to choose palette file
	openPanel.setCanChooseDirectories(true);
	openPanel.setAllowedFileTypes(fileTypes);
	openPanel.setCanChooseFiles(true);
	openPanel.setCanCreateDirectories(true);
	openPanel.setTitle("Choose a file");
	openPanel.setPrompt("Choose");
	openPanel.runModal();
	
	// Get file path to file selected
	var filePath = openPanel.URLs().firstObject().path();
	
	// Read contents of file into NSString, then to JSON
	var fileContents = NSString.stringWithContentsOfFile(filePath);
	var paletteContents = JSON.parse(fileContents.toString());
	var palette = paletteContents.colors;
	var compatibleVersion = paletteContents.compatibleVersion;
	
	if (compatibleVersion && compatibleVersion > version) {
		NSApp.displayDialog("Your plugin out of date. Please update to the latest version of Sketch Palettes.");
		return;
	}
	
	// Convert hex strings into MSColors
	var mspalette = [];
	for (var i = 0; i < palette.length; i++) {
		mspalette.push(
			MSColor.colorWithHue_saturation_brightness_alpha(
				palette[i].hue,
				palette[i].saturation,
				palette[i].brightness,
				palette[i].alpha));
	};
	
	// Convert array into MSArray
	var colors = MSArray.dataArrayWithArray(mspalette);
	
	// Load colors in target color picker section
	if (target == "document") {
		doc.documentData().assets().setColors(colors);
	} else if (target == "global" ) {
		app.globalAssets().setColors(colors);
	}
	
	app.refreshCurrentDocument();
	
}


//-------------------------------------------------------------------------------------------------------------


// Save color palette

function saveColors(context,target) {
	
	var doc = context.document;
	var app = NSApp.delegate();
	var version = context.plugin.version().UTF8String();
	
	// Get colors from target color picker section
	if (target == "document") {
		var colors = doc.documentData().assets().colors();
	} else if (target == "global"){
		var colors = app.globalAssets().colors()	
	}
	
	// Only run if there are colors
	if (colors.count() > 0) {
		
		// Save panel settings
		var savePanel = NSSavePanel.savePanel();
		savePanel.setNameFieldStringValue("untitled.sketchpalette");
		savePanel.setAllowedFileTypes([@"sketchpalette"]);
		savePanel.setAllowsOtherFileTypes(false);
		savePanel.setExtensionHidden(false);
		
		// Open save dialog and run if Save was clicked
		if (savePanel.runModal()) {
			
			// Convert MSArray into array
			var mspalette = colors.array();
			
			// Convert MSColors into HSB+alpha JSON
			var palette = [];
			for (var i = 0; i < mspalette.count(); i++) {
				palette.push({
					"hue" : mspalette[i].hue(),
					"saturation" : mspalette[i].saturation(),
					"brightness" : mspalette[i].brightness(),
					"alpha" : mspalette[i].alpha()
				});
			};
			
			// Palette data
			var fileJSON = {
				"compatibleVersion": "1.0", // minimum plugin version required to load palette
				"pluginVersion": version, // version of plugin used when saving
				"colors": palette
			}
			
			// Convert palette data to string
			var fileContents = JSON.stringify(fileJSON);
			var fileString = NSString.stringWithString(JSON.stringify(fileJSON));
			
			// Get chosen file path
			var filePath = savePanel.URL().path();
			
			// Write file to specified file path
			[fileString writeToFile:filePath atomically:true encoding:NSUTF8StringEncoding error:null];

		}
		
	} else { NSApp.displayDialog("No colors in palette!"); }

}


//-------------------------------------------------------------------------------------------------------------


// Document Colors 

function loadDocumentPalette(context) {
	loadColors(context, "document");
}

function saveDocumentPalette(context) {
	saveColors(context, "document");
}

function clearDocumentPalette(context) {	
	var doc = context.document;
	doc.documentData().assets().setColors(MSArray.dataArrayWithArray([]));
}


//-------------------------------------------------------------------------------------------------------------


// Global Colors

function loadGlobalPalette(context) {
	loadColors(context, "global");
}

function saveGlobalPalette(context) {
	saveColors(context, "global");
}

function clearGlobalPalette(context) {	
	var app = NSApp.delegate();
	app.globalAssets().setColors(MSArray.dataArrayWithArray([]));
}

