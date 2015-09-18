
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


function clearPalette(context) {
	
	var doc = context.document;
	var palette = [];	
	var mspalette = [];

	for (var i = 0; i < palette.length; i++) {
		mspalette.push(MSColor.colorWithSVGString(palette[i]));
	};

	doc.documentData().assets().setPrimitiveColors(MSArray.dataArrayWithArray(mspalette));
	
}


// ------------------------------------------------------------------------------------------------------------------------


function savePalette(context) {
	
	@import 'sandbox.js'
	
	var doc = context.document;
	var app = NSApplication.sharedApplication();
	var version = context.plugin.version().UTF8String();
	
	// Gte colors from Sketch Document Colors
	var documentColors = doc.documentData().assets().primitiveColors();
	
	
	if (documentColors.count() > 0) {
		
		var savePanel = NSSavePanel.savePanel();
	
	    savePanel.setAllowedFileTypes([@"sketchpalette"]);
		savePanel.setNameFieldStringValue("untitled.sketchpalette");
		savePanel.setAllowsOtherFileTypes(false);
		
		if (savePanel.runModal()) {
			
			// Convert MSArray into array
			var mspalette = documentColors.array();
			
			// Convert MSColors into hex strings
			var palette = [];
			for (var i = 0; i < mspalette.count(); i++) {
				palette.push("#" + mspalette[i].hexValue());
			};
			
			// Add colors and plugin version to palette object
			var fileJSON = { "pluginVersion": version, "colors": palette }
			
			// Convert palette object into string
			fileContents = JSON.stringify(fileJSON);
			
			//Write file contents to desktop
			var fileString = [NSString stringWithString: fileContents]
			var homeDir = @"/Users/" + NSUserName();
			var filePath = savePanel.URL().path();
			
			new AppSandbox().authorize(homeDir, function() {
				[fileString writeToFile:filePath atomically:true encoding:NSUTF8StringEncoding error:null];
			});	
		
		} else {	
			log("File save canceled");
		}
		
	} else {
		
		app.displayDialog("No colors in palette!");
		
	}
	
}
