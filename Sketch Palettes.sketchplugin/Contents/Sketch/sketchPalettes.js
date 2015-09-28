
// Load color palette

function loadColors(context, target) {
	
	var doc = context.document;
	var openPanel = NSOpenPanel.openPanel();
	
	// Open filepicker to choose palette file
	openPanel.setCanChooseDirectories(true);
	openPanel.setCanChooseFiles(true);
	openPanel.setCanCreateDirectories(true);
	openPanel.setTitle("Choose a file");
	openPanel.setPrompt("Choose");
	openPanel.runModal();
	
	// Get filepath to file selected
	var filePath = openPanel.URLs().firstObject().path();
	
	// Read contents of file into NSString, then to JSON
	var fileContents = NSString.stringWithContentsOfFile(filePath);
	var palette = JSON.parse(fileContents.toString()).colors;
	
	// Convert hex strings into MSColors
	var mspalette = [];
	for (var i = 0; i < palette.length; i++) {
		mspalette.push(MSColor.colorWithSVGString(palette[i]));
	};
	
	// Convert array into MSArray
	var colors = MSArray.dataArrayWithArray(mspalette);
	
	// Load colors in target color picker section
	if (target == "document") {
		doc.documentData().assets().setPrimitiveColors(colors);	
	} else if (target == "global" ) {
		doc.inspectorController().globalAssets().setPrimitiveColors(colors);
	}
	
}



// Save color palette

function saveColors(context,target) {
	
	@import 'sandbox.js'
	
	var doc = context.document;
	var app = NSApplication.sharedApplication();
	var version = context.plugin.version().UTF8String();
	
	// Get colors from target color picker section
	if (target == "document") {
		var colors = doc.documentData().assets().primitiveColors();
	} else if (target == "global"){
		var colors = doc.inspectorController().globalAssets().colors()	
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
	doc.documentData().assets().setPrimitiveColors(MSArray.dataArrayWithArray([]));
}


// Global Colors

function loadGlobalPalette(context) {
	loadColors(context, "global");
}

function saveGlobalPalette(context) {
	saveColors(context, "global");
}

function clearGlobalPalette(context) {	
	var doc = context.document;
	doc.inspectorController().globalAssets().setPrimitiveColors(MSArray.dataArrayWithArray([]));
}

