
//-------------------------------------------------------------------------------------------------------------
// Load color palette
//-------------------------------------------------------------------------------------------------------------

function loadColors(context, target) {
	
	var app = NSApp.delegate();
	var doc = context.document;
	var open = NSOpenPanel.openPanel();
	var version = context.plugin.version().UTF8String();
	var fileTypes = [NSArray arrayWithObjects:@"sketchpalette",nil];
	
	// Open file picker to choose palette file
	
	open.setAllowedFileTypes(fileTypes);
	open.setCanChooseDirectories(true);
	open.setCanChooseFiles(true);
	open.setCanCreateDirectories(true);
	open.setTitle("Choose a file");
	open.setPrompt("Choose");
	open.runModal();
	
	// Read contents of file into NSString, then to JSON
	
	var filePath = open.URLs().firstObject().path();
	var fileContents = NSString.stringWithContentsOfFile(filePath);
	var paletteContents = JSON.parse(fileContents.toString());
	var palette = paletteContents.colors;
	var compatibleVersion = paletteContents.compatibleVersion;
	
	// Check if plugin is out of date anf incompatible with a newer palette version
	
	if (compatibleVersion && compatibleVersion > version) {
		NSApp.displayDialog("Your plugin out of date. Please update to the latest version of Sketch Palettes.");
		return;
	}
	
	// Convert colors to MSColors
	// Check for older hex code palette version
	
	var colors = [];
	
	if (!compatibleVersion || compatibleVersion < 1.4) {
		for (var i = 0; i < palette.length; i++) {
			colors.push(MSColor.colorWithSVGString(palette[i]));
		};
	} else {
		for (var i = 0; i < palette.length; i++) {
			colors.push(MSColor.colorWithRed_green_blue_alpha(
				palette[i].red,
				palette[i].green,
				palette[i].blue,
				palette[i].alpha
			));	
		};
	}
	
	// Load colors in target color picker section
	
	if (target == "global") {
		app.globalAssets().setColors(colors);
	} else if (target == "document" ) {
		doc.documentData().assets().setColors(colors);
	}
	
	app.refreshCurrentDocument();
	
}


//-------------------------------------------------------------------------------------------------------------
// Save color palette
//-------------------------------------------------------------------------------------------------------------


function saveColors(context,target) {
	
	var doc = context.document;
	var app = NSApp.delegate();
	var version = context.plugin.version().UTF8String();
	
	// Get colors from target color picker section
	
	if (target == "global") {
		var colors = app.globalAssets().colors()	
	} else if (target == "document") {
		var colors = doc.documentData().assets().colors();
	}
	
	// Only run if there are colors
	
	if (colors.length > 0) {	
		
		var save = NSSavePanel.savePanel();
		save.setNameFieldStringValue("untitled.sketchpalette");
		save.setAllowedFileTypes([@"sketchpalette"]);
		save.setAllowsOtherFileTypes(false);
		save.setExtensionHidden(false);
		
		// Open save dialog and run if Save was clicked
		
		if (save.runModal()) {
			
			// Convert MSColors to rgba
			
			var palette = [];
			
			for (var i = 0; i < colors.length; i++) {
				palette.push({
					red: colors[i].red(),
					green: colors[i].green(),
					blue: colors[i].blue(),
					alpha: colors[i].alpha()	
				});
			};
			
			// Palette data

			var fileData = {
				"compatibleVersion": "1.4", // min plugin version to load palette
				"pluginVersion": version, //  plugin version used to save palette
				"colors": palette
			}
			
			// Get chosen file path
			
			var filePath = save.URL().path();
			
			// Write file to specified file path
			
			var file = NSString.stringWithString(JSON.stringify(fileData));
			
			[file writeToFile:filePath atomically:true encoding:NSUTF8StringEncoding error:null];

		}
		
	} else { NSApp.displayDialog("No colors in palette!"); }

}


//-------------------------------------------------------------------------------------------------------------
// Menu Items
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
	app.globalAssets().setColors([]);
}


// Document Colors 

function loadDocumentPalette(context) {
	loadColors(context, "document");
}

function saveDocumentPalette(context) {
	saveColors(context, "document");
}

function clearDocumentPalette(context) {	
	var doc = context.document;
	doc.documentData().assets().setColors([]);
}

