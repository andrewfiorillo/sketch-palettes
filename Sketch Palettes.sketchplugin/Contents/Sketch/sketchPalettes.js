
@import "util.js";

//-------------------------------------------------------------------------------------------------------------
// Load palette
//-------------------------------------------------------------------------------------------------------------

function loadPalette(context) {
	
	var app = NSApp.delegate();
	var doc = context.document;
	var version = context.plugin.version().UTF8String();
	var fileTypes = [NSArray arrayWithObjects:@"sketchpalette",nil];
		
	// Open file picker to choose palette file
	
	var open = NSOpenPanel.openPanel();
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
			colors.push(MSImmutableColor.colorWithSVGString(palette[i]).newMutableCounterpart());
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
	
	// Create dialog
	
	var dialog = NSAlert.alloc().init();
	dialog.setMessageText("Load Palette");
	dialog.addButtonWithTitle("Load");
	dialog.addButtonWithTitle("Cancel");
	
	// Create view to hold custom fields
	
	var customView = NSView.alloc().initWithFrame(NSMakeRect(0,0,200,80));
	
	var sourceLabel = createLabel(NSMakeRect(0, 50, 200, 25), 12, false, 'Load palette into:');
	customView.addSubview(sourceLabel);

	var source = createSelect(NSMakeRect(0, 25, 200, 25), ["Global Presets", "Document Presets"])
	customView.addSubview(source);
	
	// Add custom view to dialog
	
	dialog.setAccessoryView(customView);
	
	// Open dialog
	
	if (dialog.runModal() != NSAlertFirstButtonReturn) return;
	
	// Load colors in target color picker section
	
	if (source.indexOfSelectedItem() == 0) {
		app.globalAssets().addColors(colors);
	} else if (source.indexOfSelectedItem() == 1) {
		doc.documentData().assets().addColors(colors);
	}
	
	app.refreshCurrentDocument();
	
}


//-------------------------------------------------------------------------------------------------------------
// Save  palette
//-------------------------------------------------------------------------------------------------------------


function savePalette(context) {
	
	var doc = context.document;
	var app = NSApp.delegate();
	var version = context.plugin.version().UTF8String();
	var target = "global";
	
	// Create dialog
	
	var dialog = NSAlert.alloc().init();
	dialog.setMessageText("Save Palette");
	dialog.addButtonWithTitle("Save");
	dialog.addButtonWithTitle("Cancel");
	
	// Create view to hold custom fields
	
	var customView = NSView.alloc().initWithFrame(NSMakeRect(0,0,200,80));
	
	var sourceLabel = createLabel(NSMakeRect(0, 50, 200, 25), 12, false, 'Source:');
	customView.addSubview(sourceLabel);

	var source = createSelect(NSMakeRect(0, 25, 200, 25), ["Global Presets", "Document Presets"])
	customView.addSubview(source);
	
	// Add custom view to dialog
	
	dialog.setAccessoryView(customView);
	
	// Open dialog
	
	if (dialog.runModal() != NSAlertFirstButtonReturn) return;

	if (source.indexOfSelectedItem() == 0) {
		var colors = app.globalAssets().colors();
	} else if (source.indexOfSelectedItem() == 1) {
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
// Clear palette
//-------------------------------------------------------------------------------------------------------------

function clearPalette(context) {
	
	var doc = context.document;
	var app = NSApp.delegate();
	var version = context.plugin.version().UTF8String();
	
	// Create dialog
	
	var dialog = NSAlert.alloc().init();
	dialog.setMessageText("Clear Palette");
	dialog.addButtonWithTitle("Clear");
	dialog.addButtonWithTitle("Cancel");
	
	// Create view to hold custom fields
	
	var customView = NSView.alloc().initWithFrame(NSMakeRect(0,0,200,80));
	
	var sourceLabel = createLabel(NSMakeRect(0, 50, 200, 25), 12, false, 'Clear palette in:');
	customView.addSubview(sourceLabel);

	var source = createSelect(NSMakeRect(0, 25, 200, 25), ["Global Presets", "Document Presets"])
	customView.addSubview(source);
	
	// Add custom view to dialog
	
	dialog.setAccessoryView(customView);
	
	// Open dialog and clear chosen palette
	
	if (dialog.runModal() != NSAlertFirstButtonReturn) return;
	
	if (source.indexOfSelectedItem() == 0) {
		app.globalAssets().setColors([]);
	} else if (source.indexOfSelectedItem() == 1) {
		doc.documentData().assets().setColors([]);
	}
	
	app.refreshCurrentDocument();

}



function saveImages(context) {
	var doc = context.document;
	var app = NSApp.delegate();
	var version = context.plugin.version().UTF8String();
	
	// log(app.globalAssets().images()[0].NSImage());
	// log(doc.documentData().assets().images()[0].image().class());
	// log(doc.documentData().assets().images()[0].data().class());
	// log(doc.documentData().assets().images()[0].sha1().class());
	// doc.documentData().assets().setImages([]);
			
	var save = NSSavePanel.savePanel();
		save.setNameFieldStringValue("untitled.sketchpalette");
		save.setAllowedFileTypes([@"sketchpalette"]);
		save.setAllowsOtherFileTypes(false);
		save.setExtensionHidden(false);
		
		// Open save dialog and run if Save was clicked
		
		if (save.runModal()) {
			
			var data = doc.documentData().assets().images()[0].data()
			var nsdata = NSData.dataWithData(data);
			var basedata = [nsdata base64EncodedStringWithOptions:0]
			
			log(basedata.class())
			
			// Get chosen file path
			
			var filePath = save.URL().path();
			
			// Write file to specified file path
			
			var file = basedata;
			
			// var file = NSString.stringWithString(JSON.stringify(basedata));
			
			[file writeToFile:filePath atomically:true encoding:NSUTF8StringEncoding error:null];

		}
}


function loadImages(context) {
	
	var doc = context.document;
	var app = NSApp.delegate();
	var version = context.plugin.version().UTF8String();
	var fileTypes = [NSArray arrayWithObjects:@"sketchpalette",nil];
	
	var open = NSOpenPanel.openPanel();
	open.setAllowedFileTypes(fileTypes);
	open.setCanChooseDirectories(true);
	open.setCanChooseFiles(true);
	open.setCanCreateDirectories(true);
	open.setTitle("Choose a file");
	open.setPrompt("Choose");
	open.runModal();
	
	// Read contents of file into NSString
	
	var filePath = open.URLs().firstObject().path();
	var fileContents = NSString.stringWithContentsOfFile(filePath);
	var filestring = fileContents.toString();
	
	// Convert base64 encoded string to NSImage, then to MSImageData
	
	var nsdata = NSData.alloc().initWithBase64EncodedString_options(filestring, 0);
	var nsimage = NSImage.alloc().initWithData(nsdata);
	var msimage = MSImageData.alloc().initWithImage_convertColorSpace(nsimage, false);
	
	// Keept current images
	var currentImages = doc.documentData().assets().images().slice();
	var newImages = currentImages.concat([msimage]);
	
	doc.documentData().assets().setImages(newImages);

}

