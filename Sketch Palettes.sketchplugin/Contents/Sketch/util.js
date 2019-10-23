
function rect(x,y,w,h) {
	var rect = NSMakeRect(x,y,w,h)
	return rect;
}

/**
 * Parses hexadecimal color into RGB format
 */
function hexToRgb (hex) {
	return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
		,(m, r, g, b) => '#' + r + r + g + g + b + b)
		.substring(1).match(/.{2}/g)
		.map(x => parseInt(x, 16))
}

/**
 * Fetch JSON from a given URL
 */
function fetch(args) {
	var task = NSTask.alloc().init();
	task.setLaunchPath("/usr/bin/curl");
	task.setArguments(args);
	var outputPipe = [NSPipe pipe];
	[task setStandardOutput:outputPipe];
	task.launch();
	var responseData = [[outputPipe fileHandleForReading] readDataToEndOfFile];

	return [[[NSString alloc] initWithData:responseData encoding:NSUTF8StringEncoding]];
}

function createLabel(frame, size, bold, text) {
	var label = NSTextField.alloc().initWithFrame(frame);	
	label.setStringValue(text);
	label.setBezeled(false);
	label.setDrawsBackground(false);
	label.setEditable(false);
	label.setSelectable(false);	
	if (bold) {
		label.setFont(NSFont.boldSystemFontOfSize(size));
	}
	else {
		label.setFont(NSFont.systemFontOfSize(size));
	}
	return label;
}


function createSelect(frame, items) {
	var select = NSPopUpButton.alloc().initWithFrame(frame);
	for (var i = 0; i < items.length; i++) {
		if (items[i] == "--") {
			select.menu().addItem(NSMenuItem.separatorItem())
		} else {
			select.addItemWithTitle(items[i])
		}
	}
	return select;
}

function createInput(frame, placeholder) {
	var input = NSTextField.alloc().initWithFrame(frame);
	input.setPlaceholderString(placeholder);
	return input;
}

function createCheckbox(frame, name, value, onstate, enabled) {
	var checkbox = NSButton.alloc().initWithFrame(frame);
	checkbox.setButtonType(NSSwitchButton);
	// checkbox.setBezelStyle(1);
	checkbox.setTitle(name);
	checkbox.setTag(value);
	checkbox.setState(onstate ? NSOnState : NSOffState);
	checkbox.setEnabled(enabled);
	return checkbox;
}