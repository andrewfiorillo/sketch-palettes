
function loadPalette(context) {
	
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
	var documentColors = MSArray.dataArrayWithArray(mspalette);
	
	// Load colors into Sketch Document Colors
	doc.documentData().assets().setPrimitiveColors(documentColors);
}


// ------------------------------------------------------------------------------------------------------------------------


function savePalette(context) {
	
	@import 'sandbox.js'
	
	var doc = context.document;
	var app = NSApplication.sharedApplication();
	var version = context.plugin.version().UTF8String();
	
	// Get colors from Document Colors in color picker
	var documentColors = doc.documentData().assets().primitiveColors();
	
	// Only run if there are colors
	if (documentColors.count() > 0) {
		
		var savePanel = NSSavePanel.savePanel();
		savePanel.setNameFieldStringValue("untitled.sketchpalette");
		savePanel.setAllowedFileTypes([@"sketchpalette"]);
		savePanel.setAllowsOtherFileTypes(false);
		savePanel.setExtensionHidden(false);
		
		// Open save dialog and run if Save was clicked
		if (savePanel.runModal()) {
			
			// Convert MSArray into array
			var mspalette = documentColors.array();
			
			// Convert MSColors into hex strings
			var palette = [];
			for (var i = 0; i < mspalette.count(); i++) {
				palette.push("#" + mspalette[i].hexValue());
			};
			
			// Palette data
			var fileJSON = { "pluginVersion": version, "colors": palette }
			
			// Convert palette data to string
			fileContents = JSON.stringify(fileJSON);
			
			var fileString = NSString.stringWithString(fileContents);
			var filePath = savePanel.URL().path();
			
			// Request permission to write for App Store version of Sketch
			new AppSandbox().authorize(@"/Users/" + NSUserName(), function() {
				// Write file to specified file path
				[fileString writeToFile:filePath atomically:true encoding:NSUTF8StringEncoding error:null];
			});	
		
		}
		
	} else { app.displayDialog("No colors in palette!"); }

}


// ------------------------------------------------------------------------------------------------------------------------


function clearPalette(context) {
	
	var doc = context.document;
	doc.documentData().assets().setPrimitiveColors(MSArray.dataArrayWithArray([]));
	
}

