
@import "util.js";


//-------------------------------------------------------------------------------------------------------------
// Save palette
//-------------------------------------------------------------------------------------------------------------


function savePalette(context) {
	
	var doc = context.document;
	var app = NSApp.delegate();
	var version = context.plugin.version().UTF8String();
	var images = [], gradients = [], colors = [];
	
	// Create dialog
	
	var dialog = NSAlert.alloc().init();
	dialog.setMessageText("Save Palette");
	dialog.addButtonWithTitle("Save");
	dialog.addButtonWithTitle("Cancel");
	
	// Create custom view and fields
		
	var customView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 200, 180));
	
	var labelSource = createLabel(NSMakeRect(0, 150, 200, 25), 12, false, 'Source:');
	customView.addSubview(labelSource);

	var selectSource = createSelect(NSMakeRect(0, 125, 200, 25), ["Global Presets", "Document Presets"])
	customView.addSubview(selectSource);

	var labelFillTypes = createLabel(NSMakeRect(0, 83, 200, 25), 12, false, 'Fill Types:');
	customView.addSubview(labelFillTypes);
	
	var checkboxColors = createCheckbox(NSMakeRect(0, 60, 200, 25), "Flat Colors", "colors", true, true);
	customView.addSubview(checkboxColors);
	
	var checkboxImages = createCheckbox(NSMakeRect(0, 37, 200, 25), "Pattern Fills", "images", true, true);
	customView.addSubview(checkboxImages);
	
	// Set checkboxes to disabled if no presets exist in selected section
	
	function setCheckboxStates(selectSource) {
		if (selectSource.indexOfSelectedItem() == 0) {
			var assets = app.globalAssets();
		} else if (selectSource.indexOfSelectedItem() == 1) {
			var assets = doc.documentData().assets();
		}
		
		var showColors = (assets.colors().length > 0 ? true : false);
		checkboxColors.setState(showColors ? NSOnState : NSOffState);
		checkboxColors.setEnabled(showColors);
		
		var showImages = (assets.images().length > 0 ? true : false);
		checkboxImages.setState(showImages ? NSOnState : NSOffState);
		checkboxImages.setEnabled(showImages);
	}
	
	// set initial chekcbox states
	
	setCheckboxStates(selectSource);
	
	// Listen for select box change event
	
	selectSource.setCOSJSTargetFunction(function(sender) {
		setCheckboxStates(selectSource)
	});
	
	// Add custom view to dialog

	dialog.setAccessoryView(customView);
	
	// Open dialog and exit if user selects Cancel
	
	if (dialog.runModal() != NSAlertFirstButtonReturn) {
		return;
	}
	
	// Get Presets from selected section
	
	if (selectSource.indexOfSelectedItem() == 0) {
		var assets = app.globalAssets();
	} else if (selectSource.indexOfSelectedItem() == 1) {
		var assets = doc.documentData().assets();
	}
	
	colors = checkboxColors.state() ? assets.colors() : [];
	images = checkboxImages.state() ? assets.images() : [];
	
	// Check to make sure there are presets available
	
	if (colors.length < 0 && images.length < 0) {
		NSApp.displayDialog("No presets available!");
		return;
	}
	
	// Create save dialog
	
	var save = NSSavePanel.savePanel();
	save.setNameFieldStringValue("untitled.sketchpalette");
	save.setAllowedFileTypes(["sketchpalette"]);
	save.setAllowsOtherFileTypes(false);
	save.setExtensionHidden(false);
		
	// Open save dialog and run if Save was clicked
	
	if (save.runModal()) {
		
		// Build color palette
		
		var colorPalette = [];
			
		for (var i = 0; i < colors.length; i++) {
			colorPalette.push({
				red: colors[i].red(),
				green: colors[i].green(),
				blue: colors[i].blue(),
				alpha: colors[i].alpha()	
			});
		};
		
		// Build image palette
		
		var imagePalette = []
		
		for (var i = 0; i < images.length; i++) {	
			var data = images[i].data()
			var nsdata = NSData.dataWithData(data);
			var base64Color = nsdata.base64EncodedStringWithOptions(0).UTF8String();
			imagePalette.push(base64Color);
		};
		
		// Assemble file contents
		
		var fileData = {
			"compatibleVersion": "1.4", // min plugin version to load palette
			"pluginVersion": version, //  plugin version used to save palette
			"colors": colorPalette,
			"images":  imagePalette
		}
		
		// Write file to chosen file path
		
		var filePath = save.URL().path();
		var file = NSString.stringWithString(JSON.stringify(fileData));
		
		file.writeToFile_atomically_encoding_error(filePath, true, NSUTF8StringEncoding, null);

	}
}


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
	var compatibleVersion = paletteContents.compatibleVersion;
	var colorPalette = paletteContents.colors ? paletteContents.colors : [];
	var gradientPalette = paletteContents.gradients ? paletteContents.gradients : [];
	var imagePalette = paletteContents.images ? paletteContents.images : [];
	
	// Check if plugin is out of date anf incompatible with a newer palette version
	
	if (compatibleVersion && compatibleVersion > version) {
		NSApp.displayDialog("Your plugin out of date. Please update to the latest version of Sketch Palettes.");
		return;
	}
	
	var colors = [], gradients = [], images = [];
	
	// Check for older hex code palette version
		
	if (!compatibleVersion || compatibleVersion < 1.4) {
		
		// Convert hex colors to MSColors
		
		for (var i = 0; i < palette.length; i++) {
			colors.push(MSImmutableColor.colorWithSVGString(palette[i]).newMutableCounterpart());
		};
		
	} else {
		
		// Convert rgba colors to MSColors
		
		if (colorPalette.length > 0) {
			for (var i = 0; i < colorPalette.length; i++) {
				colors.push(MSColor.colorWithRed_green_blue_alpha(
					colorPalette[i].red,
					colorPalette[i].green,
					colorPalette[i].blue,
					colorPalette[i].alpha
				));	
			};	
		}
		
		// convert base64 strings to MSImageData objects
		
		if (imagePalette.length > 0) {
			for (var i = 0; i < imagePalette.length; i++) {
				var nsdata = NSData.alloc().initWithBase64EncodedString_options(imagePalette[i], 0);
				var nsimage = NSImage.alloc().initWithData(nsdata);
				var msimage = MSImageData.alloc().initWithImage_convertColorSpace(nsimage, false);
				images.push(msimage);	
			};
		}
	}
	
	// Create dialog
	
	var dialog = NSAlert.alloc().init();
	dialog.setMessageText("Load Palette");
	dialog.addButtonWithTitle("Load");
	dialog.addButtonWithTitle("Cancel");
	
	// Create view to hold custom fields
	
	var customView = NSView.alloc().initWithFrame(NSMakeRect(0,0,200,80));
	
	var labelSource = createLabel(NSMakeRect(0, 50, 200, 25), 12, false, 'Load palette into:');
	customView.addSubview(labelSource);

	var selectSource = createSelect(NSMakeRect(0, 25, 200, 25), ["Global Presets", "Document Presets"])
	customView.addSubview(selectSource);
	
	// Add custom view to dialog
	
	dialog.setAccessoryView(customView);
	
	// Open dialog and exit if user hits cancel.
	
	if (dialog.runModal() != NSAlertFirstButtonReturn) return;
	
	// Get target picker section
	
	if (selectSource.indexOfSelectedItem() == 0) {
		var assets = app.globalAssets();
	} else if (selectSource.indexOfSelectedItem() == 1) {
		var assets = doc.documentData().assets();
	}
		
	// Append presets
	
	if (colors.length > 0) {
		assets.addColors(colors);	
	}
	if (images.length > 0) {
		var newImages = assets.images().slice().concat(images);
		assets.setImages(newImages);	
	}
	
	app.refreshCurrentDocument();
	
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
	
	var labelSource = createLabel(NSMakeRect(0, 50, 200, 25), 12, false, 'Clear palette in:');
	customView.addSubview(labelSource);

	var selectSource = createSelect(NSMakeRect(0, 25, 200, 25), ["Global Presets", "Document Presets"])
	customView.addSubview(selectSource);
	
	// Add custom view to dialog
	
	dialog.setAccessoryView(customView);
	
	// Open dialog and clear chosen palette
	
	if (dialog.runModal() != NSAlertFirstButtonReturn) return;
	
	if (selectSource.indexOfSelectedItem() == 0) {
		var assets = app.globalAssets();
	} else if (selectSource.indexOfSelectedItem() == 1) {
		var assets = doc.documentData().assets();
	}
	
	assets.setColors([]);
	assets.setImages([]);
	
	app.refreshCurrentDocument();

}

