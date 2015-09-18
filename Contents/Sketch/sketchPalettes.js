@import 'sandbox.js'

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
	
	// Read contents of file into NSString
	var fileContents = NSString.stringWithContentsOfFile(filePath);
	
	// Convert file contents to JSON object
	var fileJSON = JSON.parse(fileContents.toString());
	
	var palette = fileJSON.colors;
	var mspalette = [];
	
	// Convert hex strings into MSColors
	for (var i = 0; i < palette.length; i++) {
		var mscolor = MSColor.colorWithSVGString(palette[i]);
		mspalette.push(mscolor);
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
	
	var doc = context.document;
	var app = NSApplication.sharedApplication();
	var version = context.plugin.version().UTF8String();
	
	// Gte colors from Sketch Document Colors
	var documentColors = doc.documentData().assets().primitiveColors();
	
	
	if (documentColors.count() > 0) {
	
		// Convert MSArray into array
		var mspalette = documentColors.array();
		
		// Convert MSColors into hex strings
		var palette = [];
		for (var i = 0; i < mspalette.count(); i++) {
			palette.push("#" + mspalette[i].hexValue());
		};
		
		// Add colors and plugin version to palette object
		var fileJSON = {
			"pluginVersion": version,
			"colors": palette
		}
		
		// Convert palette object into string
		fileContents = JSON.stringify(fileJSON);
		
		// log(fileContents);
		
		
		//Write file contents to desktop
		
		var fileString = [NSString stringWithString: fileContents]
		var homeDir = @"/Users/" + NSUserName()
		var filePath = homeDir + "/Desktop/okcupid.sketchpalette"]
		
		new AppSandbox().authorize(homeDir, function() {
			[fileString writeToFile:filePath atomically:true encoding:NSUTF8StringEncoding error:null];
		});
		
	} else {
		
		app.displayDialog("No colors in palette!");
		
	}
	
	
	
	
	
	return;
	
	
	
	
	
	
	
	
	
	// Save text file to desktop
	// Requires sandbox permissions
	
	var fileString = [NSString stringWithString: @"test"]
	var homeDir = @"/Users/" + NSUserName()
	var filePath = homeDir + "/Desktop/test.txt"]
	
	new AppSandbox().authorize(homeDir, function() {
		[fileString writeToFile:filePath atomically:true encoding:NSUTF8StringEncoding error:null];
	});
	
	return;
	
	var doc = context.document;
	var app = NSApplication.sharedApplication();
	var version = context.plugin.version().UTF8String();
	
	var savePanel = NSSavePanel.savePanel();
	var fileType = NSString.stringWithString("sketchpalette");
	
	log(fileType.class());
	
	return;
	
 	// set the save panel to only do jpg and png file
    savePanel.setAllowedFileTypes(NSArray.initWithObjects(fileType));
    
 	
	savePanel.setNameFieldStringValue("untitled.sketchpalette");
	savePanel.setAllowsOtherFileTypes(true);
	// savePanel.setAllowedFileTypes(fileTypes);

	
	savePanel.runModal();
	
	// log(savePanel)
	
	// openPanel.setCanChooseDirectories(true);
	// openPanel.setCanChooseFiles(true);
	// openPanel.setCanCreateDirectories(true);
	// openPanel.setTitle("Choose a file");
	// openPanel.setPrompt("Choose");
	// openPanel.runModal();
	
	
	
	return;
	
}




