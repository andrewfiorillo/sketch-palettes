
// Load color palette

function loadColors(context, target) {
	
	var app = NSApplication.sharedApplication();
	var appController = app.delegate();
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
		app.displayDialog("Your plugin out of date. Please update to the latest version of Sketch Palettes.");
		return;
	}
	
	// Convert hex strings into MSColors
	var mspalette = [];
	for (var i = 0; i < palette.length; i++) {
		mspalette.push(MSColor.colorWithSVGString(palette[i]));
	};
	
	// Convert array into MSArray
	var colors = MSArray.dataArrayWithArray(mspalette);
	
	// Load colors in target color picker section
	if (target == "document") {
		doc.documentData().assets().setColors(colors);
	} else if (target == "global" ) {
		appController.globalAssets().setColors(colors);
	}
	
	appController.refreshCurrentDocument();
	
}


//-------------------------------------------------------------------------------------------------------------


// Save color palette

function saveColors(context,target) {
	
	@import 'sandbox.js' // You can probably get rid of this, since versions greater than 3.4.4 are no longer sandboxed
	
	var doc = context.document;
	var app = NSApplication.sharedApplication();
	var appController = app.delegate();
	var version = context.plugin.version().UTF8String();
	
	// Get colors from target color picker section
	if (target == "document") {
		var colors = doc.documentData().assets().primitiveColors();
	} else if (target == "global"){
		var colors = appController.globalAssets().colors()	
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
			
			// Convert MSColors into hex strings
			var palette = [];
			for (var i = 0; i < mspalette.count(); i++) {
				palette.push("#" + mspalette[i].hexValue());
			};
			
			// Palette data
			var fileJSON = {
				"compatibleVersion": "1.0", // minimum plugin version required to load palette
				"pluginVersion": version, // version of plugin used when saving
				"colors": palette
			}
			
			// Convert palette data to string
			fileContents = JSON.stringify(fileJSON);
			var fileString = NSString.stringWithString(fileContents);
			
			// Get chosen file path
			var filePath = savePanel.URL().path();
			
			// Request permission to write for App Store version of Sketch
			new AppSandbox().authorize(@"/Users/" + NSUserName(), function() {
				// Write file to specified file path
				[fileString writeToFile:filePath atomically:true encoding:NSUTF8StringEncoding error:null];
			});	

		}
		
	} else { app.displayDialog("No colors in palette!"); }

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
	var app = NSApplication.sharedApplication();
	var appController = app.delegate();
	appController.globalAssets().setColors(MSArray.dataArrayWithArray([]));
}

