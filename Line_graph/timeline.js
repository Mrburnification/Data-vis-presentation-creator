// timeline.js

//import * as XLSX from 'xlsx'
// to include later

let tracks = [];
let selectedElement = null;

const elementRegistry = {
    
    blank: {
        create: (startClick) => new bblank(getRandomColor()),
        editFields: [{ label: "Box Color", type: "color", property: "colorbox" },
            { label: "Transitions", type: "transition", property: "transitionJSON" }]
    },

    bcircle: {
        create: (startClick) => new bcircle(getRandomColor()),
        editFields: [{ label: "Box Color", type: "color", property: "colorbox" },
            { label: "Transitions", type: "transition", property: "transitionJSON" }]
    },
    textbox: {
        create: (startClick) => new Textbox(getRandomColor(), "Hello", width / 2, height / 2, 32),
        editFields: [
            { label: "Text", type: "text", property: "text" },
            { label: "Box Color", type: "color", property: "colorbox" },
            { label: "Size", type: "number", property: "size" },
            { label: "Color", type: "color", property: "color" },
            { label: "X Position", type: "number", property: "x" },
            { label: "Y Position", type: "number", property: "y" },
            { label: "Opacity", type: "range", property: "opacity", min: 0, max: 1, step: 0.1 },
            { label: "Visible", type: "checkbox", property: "visible" },
            { label: "Transitions", type: "transition", property: "transitionJSON" },        { 
                label: "Text Align", 
                type: "dropdown", 
                property: "textalign", 
                values: ["LEFT", "RIGHT", "CENTER"] 
            },
        ]
    },
    writeword: {
        create: (startClick) => new writeWord(getRandomColor()),
        editFields: [
            { label: "Text", type: "text", property: "word", units:"text"},
            { label: "Box Color", type: "color", property: "colorbox" },
            { label: "Size", type: "number", property: "size" },
            { label: "X Position", type: "number", property: "x" },
            { label: "Text Speed", type: "number", property: "textspd" },
            { label: "Y Position", type: "number", property: "y" },
            { label: "Opacity", type: "range", property: "opacity", min: 0, max: 255, step: 1 },
            { label: "write?", type: "checkbox", property: "write" },
            { label: "fade?", type: "checkbox", property: "fade" },
            { label: "Transitions", type: "transition", property: "transitionJSON" }
        ]
    },

    targetbox: {
        create: (startClick) => new targetBox(getRandomColor()),
        editFields: [
            { label: "Text", type: "text", property: "text", units:"text"},
            { label: "result", type: "number", property: "result" },
            { label: "target", type: "number", property: "target" },
            { label: "Box Color", type: "color", property: "colorbox" },
            { label: "Color", type: "color", property: "color" },
            { label: "Scale", type: "number", property: "scaler" },
            { label: "X Position", type: "number", property: "x" },
            { label: "Y Position", type: "number", property: "y" },
            { label: "Opacity", type: "range", property: "opacity", min: 0, max: 255, step: 1 },
            { label: "Shadow", type: "checkbox", property: "shadow" },
            { label: "Transitions", type: "transition", property: "transitionJSON" }
        ]
    },

    piegraph: {
        create: (startClick) => new PieGraph(getRandomColor()),
        editFields: [
            { label: "Title", type: "text", property: "text", units:"text"},
            { label: "result", type: "number", property: "result" },
            { label: "Data", type: "csv", property: "data" },
            { label: "Labels", type: "csv", property: "labels" },
            { label: "target", type: "number", property: "target" },
            { label: "Box Color", type: "color", property: "colorbox" },
            { label: "Color", type: "color", property: "color" },
            { label: "Colors", type: "dynamicColor", property: "colors" },
            { label: "Scale", type: "number", property: "scaler" },
            { label: "X Position", type: "number", property: "x" },
            { label: "Y Position", type: "number", property: "y" },
            { label: "Animation speed", type: "number", property: "animationStep"},
            { label: "Transitions", type: "transition", property: "transitionJSON" }
        ]
    },
    columngraph: {
        create: (startClick) => new ColumnGraph(getRandomColor(), 100, 100, 200),
        editFields: [
          { label: "X Position", type: "number", property: "x" },
          { label: "Y Position", type: "number", property: "y" },
          { label: "Box Color", type: "color", property: "colorbox" },
          { label: "Size", type: "number", property: "size" },
          { label: "Data values", type: "csv", property: "data" },
          { label: "Data labels", type: "csv", property: "dataLabels" },
          { label: "Max Value", type: "number", property: "maxValue" },
          { label: "Ticks X", type: "number", property: "ticks_x" },
          { label: "Ticks Y", type: "number", property: "ticks_y" },
          { label: "Column Width", type: "number", property: "columnWidth" },
          { label: "Animation Type", type: "dropdown", property: "animationType", values: ["sequential", "simultaneous"] },
          { label: "Current Animating Column", type: "number", property: "currentAnimatingColumn" },
          { label: "Colors", type: "dynamicColor", property: "colors" },
          { label: "Transitions", type: "transition", property: "transitionJSON" }
        ]
      }
      
};

// Example usage


document.getElementById('add-track').addEventListener('click', () => {
    addTrack();
    updateTimeline();
});

document.getElementById('reset-timeline').addEventListener('click', () => {
    resetTimeline();
    updateTimeline();
});

document.getElementById('reset-animations').addEventListener('click', () => {
    resetAnimations();
    updateTimeline();
});

document.getElementById('click-back').addEventListener('click', () => {
    clickBack();
    updateTimeline();
});

document.getElementById('click-forward').addEventListener('click', () => {
    clickForward();
    updateTimeline();
});

document.getElementById('canvas-options').addEventListener('click', () => {
    //console.log("canvas options");
    showEditPopupCanvas();
});



//changed slightly
document.addEventListener('DOMContentLoaded', () => {
    // Your script here
    document.getElementById('save-element').addEventListener('click', saveElement);
    // Other event listeners
});

function addTrack() {
    tracks.push([]);
    updateTimeline();
}

function addElement(trackIndex) {
    const trackDiv = document.querySelector(`.track[data-track-index="${trackIndex}"] div[class="elements"]`);
    const selectContainer = document.createElement('div');
    selectContainer.className = 'select-container';

    const dropdown = document.createElement('select');
    dropdown.className = "element-dropdown";

    // Dynamically generate options from elementRegistry
    Object.keys(elementRegistry).forEach(key => {
        // if (key !== 'blank') {  // Exclude 'blank' if you don't want it in the dropdown
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key.charAt(0).toUpperCase() + key.slice(1);  // Capitalize first letter
            dropdown.appendChild(option);
        // }
    });

    selectContainer.appendChild(dropdown);

    const addButton = document.createElement('button');
    addButton.innerText = 'Add';
    addButton.className = "Add-element-button";
    selectContainer.appendChild(addButton);

    trackDiv.appendChild(selectContainer);

    addButton.addEventListener('click', () => {
        const elementType = dropdown.value;
        if (elementRegistry[elementType]) {
            const element = elementRegistry[elementType].create(tracks[trackIndex].length + 1);
            tracks[trackIndex].push(element);
            updateTimeline();
        } else {
            alert("Invalid element type!");
        }
        trackDiv.removeChild(selectContainer);
    });
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
        // Generate darker colors by limiting each digit to '0-7'
        color += letters[Math.floor(Math.random() * 8)];
    }
    
    return color;
}

function updateTimeline() {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';
    let totalClicks = 0;

    tracks.forEach((track, trackIndex) => {
        const trackDiv = document.createElement('div');
        trackDiv.className = 'track';
        trackDiv.dataset.trackIndex = trackIndex;

        const trackTitle = document.createElement('div');
        trackTitle.className = 'track-title';
        trackTitle.innerText = `Track ${trackIndex + 1} `;
        const elementCountSpan = document.createElement('span');
        elementCountSpan.className = 'element-count';
        elementCountSpan.innerText = `(${track.length} elements)`;
        trackTitle.appendChild(elementCountSpan);
        trackDiv.appendChild(trackTitle);

        const elementsDiv = document.createElement('div');
        elementsDiv.className = 'elements';
        trackDiv.appendChild(elementsDiv);

        const addElementButton = document.createElement('button');
        addElementButton.innerHTML = '+ <br> Add Element';
        addElementButton.className = "element_placeholder"
        addElementButton.addEventListener('click', () => addElement(trackIndex));
        elementsDiv.appendChild(addElementButton);

        track.forEach((element, elementIndex) => {
            element.startClick = totalClicks + 1;
            const elementDiv = document.createElement('div');
            elementDiv.className = 'element';
            elementDiv.style.backgroundColor = element.colorbox || '#ff0000';
            //elementDiv.textContent = element[0];
            const elementNameInput = document.createElement('input');
            const copyIcon = document.createElement('i');
            copyIcon.className = 'material-icons';
            copyIcon.id = `copy-content-${trackIndex}-${elementIndex}`;
            copyIcon.innerHTML = 'content_copy';
            copyIcon.addEventListener('click', () => {
                // Retrieve the track and element index from the copy icon id
                const ids = copyIcon.id.split('-');
                const trackIndex = parseInt(ids[2]);
                const elementIndex = parseInt(ids[3]);
                
                // Retrieve the selected element
                const elementToCopy = tracks[trackIndex][elementIndex];
                
                // Find the type of the selected element
                const elementType = Object.keys(elementRegistry).find(key => {
                    return elementRegistry[key].create(0).constructor === elementToCopy.constructor;
                });
            
                if (elementType && elementRegistry[elementType]) {
                    // Create a copy of the element
                    const copiedElement = elementRegistry[elementType].create(tracks[trackIndex].length + 1);
                    
                    // Copy properties from original to copied element
                    Object.assign(copiedElement, elementToCopy);
            
                    // Push the copied element to the track
                    tracks[trackIndex].push(copiedElement);
            
                    // Update the timeline to reflect the changes
                    updateTimeline();
                } else {
                    alert("Invalid element type!");
                }
            });
            elementNameInput.className = "element_names";
            elementNameInput.type = 'text';
            elementNameInput.value = element.name || '';
            elementNameInput.addEventListener('change', (e) => {
                element.name = e.target.value;
                // Optionally, save the updated element name if needed
            });
            elementDiv.draggable = true;
            elementDiv.dataset.trackIndex = trackIndex;
            elementDiv.dataset.elementIndex = elementIndex;
            elementDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                showEditPopup(trackIndex, elementIndex);
            });
            elementsDiv.appendChild(elementDiv);
            elementDiv.appendChild(elementNameInput);
            elementDiv.appendChild(copyIcon);
            elementDiv.addEventListener('dragstart', handleDragStart);
            elementDiv.addEventListener('dragover', handleDragOver);
            elementDiv.addEventListener('drop', handleDrop);

            totalClicks++;
        });

        const progressclicks = clickCount;
        const progressLine = document.createElement('div');
        progressLine.className = 'progress-line';

        // Calculate the position of the progress line
        if (progressclicks > 0) {
            const position = progressclicks / (track.length + 1);
            progressLine.style.position = 'absolute';
            progressLine.style.height = '100%';
            progressLine.style.width = '2px';
            progressLine.style.backgroundColor = 'red';
            progressLine.style.left = `${progressclicks * 100}px`;
        }

        trackDiv.appendChild(progressLine);
        timeline.appendChild(trackDiv);
    });

    const trackDivs = document.querySelectorAll('.track');
    trackDivs.forEach(trackDiv => {
        trackDiv.addEventListener('dragstart', handleTrackDragStart);
        trackDiv.addEventListener('dragover', handleTrackDragOver);
        trackDiv.addEventListener('drop', handleTrackDrop);
    });
    //const clickCountDisplay = document.getElementById('click-count');
    //clickCountDisplay.innerText = `Total Clicks: ${clickCount}`;
}

let draggedElement = null;
let draggedTrack = null;

function handleDragStart(event) {
    draggedElement = event.target;
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    if (draggedElement) {
        const target = event.target.closest('.element');
        if (target && target !== draggedElement) {
            const targetTrackIndex = parseInt(target.dataset.trackIndex);
            const targetElementIndex = parseInt(target.dataset.elementIndex);
            const draggedTrackIndex = parseInt(draggedElement.dataset.trackIndex);
            const draggedElementIndex = parseInt(draggedElement.dataset.elementIndex);

            const [draggedElementData] = tracks[draggedTrackIndex].splice(draggedElementIndex, 1);
            tracks[targetTrackIndex].splice(targetElementIndex, 0, draggedElementData);

            updateTimeline();
        }
    }
    draggedElement = null;
}

function handleTrackDragStart(event) {
    draggedTrack = event.target;
}

function handleTrackDragOver(event) {
    event.preventDefault();
}

function handleTrackDrop(event) {
    event.preventDefault();
    if (draggedTrack) {
        const target = event.target.closest('.track');
        if (target && target !== draggedTrack) {
            const targetTrackIndex = parseInt(target.dataset.trackIndex);
            const draggedTrackIndex = parseInt(draggedTrack.dataset.trackIndex);

            const [draggedTrackData] = tracks.splice(draggedTrackIndex, 1);
            tracks.splice(targetTrackIndex, 0, draggedTrackData);

            updateTimeline();
        }
    }
    draggedTrack = null;
}


function saveElement() {
    if (selectedElement) {
        const form = document.getElementById('element-form');
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            const property = input.dataset.property;
            if (input.type === 'number' || input.type === 'range') {
                selectedElement[property] = parseFloat(input.value);
            } else if (input.type === 'checkbox') {
                selectedElement[property] = input.checked;
            } else {
                selectedElement[property] = input.value;
            }
        });
        updateTimeline();
        closePopup();
    }
}



function showEditPopup(trackIndex, elementIndex) {
    selectedElement = tracks[trackIndex][elementIndex];
    const popup = document.getElementById('element-popup');
    const form = document.getElementById('element-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission
    });
    form.innerHTML = '';

    const element = selectedElement;
    const elementType = Object.keys(elementRegistry).find(type => element instanceof elementRegistry[type].create(0).constructor);
    if (!elementType) {
        alert('Unknown element type');
        return;
    }

    const fields = elementRegistry[elementType].editFields;
    const nameholder = document.createElement('div');
    nameholder.className = "name-in-edit";
    nameholder.textContent = "(" + selectedElement.name + ")";
    form.appendChild(nameholder);
    fields.forEach((field, index) => {

        const subform = document.createElement('div');
        subform.className = "element-sub-form";
        form.appendChild(subform);

        const subform_name = document.createElement('div');
        const subform_content = document.createElement('div');
        const subform_units = document.createElement('div');
        
        subform_name.className = 'element-sub-form-name';
        subform_content.className = 'element-sub-form-content';
        subform_units.className = 'element-sub-form-units';
        
        subform.appendChild(subform_name);
        subform.appendChild(subform_content);
        subform.appendChild(subform_units);

        const label = document.createElement('label');
        label.textContent = field.label;
        subform_name.appendChild(label);
        let colorContainer;
        let input;
        switch (field.type) {
            case 'text':
            case 'number':
            case 'color':
                input = document.createElement('input');
                input.type = field.type;
                input.value = element[field.property];
                input.dataset.property = field.property;
                break;
            case 'range':
                const rangeContainer = document.createElement('div');
                rangeContainer.className = 'range-container';
            
                input = document.createElement('input');
                input.type = 'range';
                input.min = field.min;
                input.max = field.max;
                input.step = field.step;
                input.value = element[field.property];
                input.className = "slider";
                input.dataset.property = field.property;
            
                const numberInput = document.createElement('input');
                numberInput.type = 'number';
                numberInput.min = field.min;
                numberInput.max = field.max;
                numberInput.step = field.step;
                numberInput.value = element[field.property];
                numberInput.className = "range-number-input";
                input.dataset.property = field.property;
            
                rangeContainer.appendChild(input);
                rangeContainer.appendChild(numberInput);
            
                // Update number input when slider changes
                input.addEventListener('input', (event) => {
                    numberInput.value = event.target.value;
                    updateElementProperty(element, field, event.target.value);
                });
            
                // Update slider when number input changes
                numberInput.addEventListener('input', (event) => {
                    input.value = event.target.value;
                    updateElementProperty(element, field, event.target.value);
                });
            
                subform_content.appendChild(rangeContainer);
                break;
            case 'dropdown':
                input = document.createElement('select');
                input.className = "inputs dropdown";
                input.dataset.property = field.property;
            
                // Check if the field has a 'values' property
                if (field.values && Array.isArray(field.values)) {
                    field.values.forEach(value => {
                        const option = document.createElement('option');
                        option.value = value;
                        option.textContent = value;
                        if (element[field.property] === value) {
                            option.selected = true;
                        }
                        input.appendChild(option);
                    });
                }
            
                input.addEventListener('change', (event) => {
                    element[field.property] = event.target.value;
                });
            
                subform_content.appendChild(input);
                break;
            case 'checkbox':
                const switchLabel = document.createElement('label');
                switchLabel.className = 'switch';

                input = document.createElement('input');
                input.type = 'checkbox';
                input.checked = element[field.property];
                input.dataset.property = field.property;

                const sliderSpan = document.createElement('span');
                sliderSpan.className = 'SWslider round';

                switchLabel.appendChild(input);
                switchLabel.appendChild(sliderSpan);

                subform_content.appendChild(switchLabel);
                break;
            case 'csv':
                input = document.createElement('textarea');
                input.className = "inputs csv";
                input.value = element[field.property].join(', ');
                input.dataset.property = field.property;
                input.addEventListener('change', (event) => {
                    const newValues = event.target.value.split(',').map(item => item.trim());
                    if (field.property === 'data') {
                        element.updateData(newValues);
                        if (colorContainer) {
                            updateColorInputs(element.data.length);
                        }
                    } else {
                        element[field.property] = newValues;
                    }
                });
                subform_content.appendChild(input);
                break;
            
            case 'dynamicColor':
                
                colorContainer = document.createElement('div');
                colorContainer.className = 'dynamic-color-container';
                colorContainer.id = 'color-container';
            
                function updateColorInputs(count) {
                    if (!colorContainer) return;
                    colorContainer.innerHTML = '';
                    for (let i = 0; i < count; i++) {
                        const colorInput = document.createElement('input');
                        colorInput.type = 'color';
                        colorInput.className = 'color-input';
                        colorInput.value = element.getColor(i);
                        colorInput.dataset.index = i;
                        colorInput.addEventListener('input', (event) => {
                            element.colors[event.target.dataset.index] = event.target.value;
                        });
                        colorContainer.appendChild(colorInput);
                    }
                }
            
                updateColorInputs(element.data.length);
                subform_content.appendChild(colorContainer);
                break;
            case 'transition':
                const setInitialStatesButton = document.createElement('button');
                setInitialStatesButton.type = 'button';
                setInitialStatesButton.innerText = 'Set Initial States';
                setInitialStatesButton.id = 'set-initial-states-button';
                setInitialStatesButton.addEventListener('click', () => {
                    selectedElement.setInitialStates();
                    alert('Initial states have been set!');
                });
                form.appendChild(setInitialStatesButton);
                const transitionContainer = document.createElement('div');
                transitionContainer.className = 'transition-container';
            
                const addTransitionButton = document.createElement('button');
                addTransitionButton.textContent = 'Add Transition';
                addTransitionButton.id = 'transition-button';
                addTransitionButton.type = 'button'; // Explicitly set type to 'button'
                addTransitionButton.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent form submission
                    addTransitionField(transitionContainer, element);
                });
            
                transitionContainer.appendChild(addTransitionButton);
                subform_content.appendChild(transitionContainer);


                // Load existing transitions
                if (element[field.property] && element[field.property].transitions) {
                    element[field.property].transitions.forEach((transition, index) => {
                        addTransitionField(transitionContainer, element, transition, index);
                    });
                }
                break;
        }


        //add class for inputs
        if (field.type === 'checkbox') {
            //no class needed as I changed the styling to be a switch
            //input.className ="inputs";
        } else if (field.type === 'number') {
            input.className ="inputs";
        } else if(field.type === 'range') {
            input.className ="slider"
        } else if(field.type === 'transition'){
            //no changes put here to stop bug
        }else if(field.type === 'text'){
            input.className ="inputs";
        }else if(field.type === 'color'){
            input.className ="color-inputs";
        }else {
            //input.className ="inputs";
        } 


        //for range calcualtion
        function updateElementProperty(element, field, value) {
            const property = field.property;
            element[property] = parseFloat(value);
        }

            if (input){
            input.addEventListener('input', (event) => {
                const property = event.target.dataset.property;
                if (field.type === 'checkbox') {
                    element[property] = event.target.checked;
                } else if (field.type === 'number' || field.type === 'range') {
                    updateElementProperty(element, field, event.target.value);
                } else {
                    element[property] = event.target.value;
                }
            });

            if (field.type !== 'checkbox') {
                subform_content.appendChild(input);
            }

            if (field.units) {
                const unitsSpan = document.createElement('span');
                unitsSpan.textContent = field.units;
                subform_units.appendChild(unitsSpan);
            }
        }
    });

    // Add Free Click button for X and Y
    const freeClickButton = document.createElement('button');
    freeClickButton.type = 'button';
    freeClickButton.innerText = 'Set Position by Click';
    freeClickButton.id = 'free-click-button';
    freeClickButton.addEventListener('click', () => {
        startFreeClickMode(trackIndex, elementIndex);
    });
    form.appendChild(freeClickButton);

    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.innerText = 'Delete Element';
    deleteButton.className = "deleteButton";
    deleteButton.addEventListener('click', () => {
        deleteElement(trackIndex, elementIndex);
    });
    form.appendChild(deleteButton);

    // Show the popup
    popup.style.display = 'flex';
}

//transition field adder

function addTransitionField(container, element, transition = null, index = null) {
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'transition-field';

    const clickInput = document.createElement('input');
    clickInput.type = 'number';
    clickInput.placeholder = 'Click no.';
    clickInput.className = 'inputs';
    clickInput.value = transition ? transition.click : '';

    const propertySelect = document.createElement('select');
    propertySelect.className = 'inputs dropdown';
    for (const prop in element) {
        if (typeof element[prop] !== 'function' && prop !== 'transitionJSON') {
            const option = document.createElement('option');
            option.value = prop;
            option.textContent = prop;
            propertySelect.appendChild(option);
        }
    }
    if (transition) propertySelect.value = transition.property;

    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.placeholder = 'Value';
    valueInput.className = 'inputs';
    valueInput.value = transition ? transition.value : '';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.type = 'button'; // Explicitly set type to 'button'
    deleteButton.id = 'transition-button';
    deleteButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form submission
        container.removeChild(fieldContainer);
        updateTransitionJSON(element);
    });

    fieldContainer.appendChild(clickInput);
    fieldContainer.appendChild(propertySelect);
    fieldContainer.appendChild(valueInput);
    fieldContainer.appendChild(deleteButton);

    container.insertBefore(fieldContainer, container.lastChild);

    // Update transitionJSON when inputs change
    [clickInput, propertySelect, valueInput].forEach(input => {
        input.addEventListener('input', () => updateTransitionJSON(element));
    });

    updateTransitionJSON(element);
}

function updateTransitionJSON(element) {
    const transitionFields = document.querySelectorAll('.transition-field');
    const transitions = Array.from(transitionFields).map((field, index) => {
        const [clickInput, propertySelect, valueInput] = field.querySelectorAll('input, select');
        return {
            no: index + 1,
            click: parseInt(clickInput.value),
            property: propertySelect.value,
            value: valueInput.value
        };
    });
    element.transitionJSON = { transitions };
}

// end transition field adder


function deleteElement(trackIndex, elementIndex) {
    tracks[trackIndex].splice(elementIndex, 1); // Remove the selected element from the array
    //draw(); // Update the canvas to reflect the deletion
    document.getElementById('element-popup').style.display = 'none'; // Hide the popup
    updateTimeline();
}


function showEditPopupCanvas() {
    const popup = document.getElementById('element-popup');
    const form = document.getElementById('element-form');
    form.innerHTML = '';

    let canvas = document.getElementById('defaultCanvas0');
    let currentWidth = canvas.width;
    let currentHeight = canvas.height;

    // Create and append the title
    const nameholder = document.createElement('div');
    nameholder.className = "name-in-edit";
    nameholder.textContent = "Canvas Settings Edit Menu";
    form.appendChild(nameholder);

    // Create subform container
    const subform = document.createElement('div');
    subform.className = 'element-sub-form';
    
    // Create and populate subform sections
    const subform_name = document.createElement('div');
    const subform_content = document.createElement('div');
    const subform_units = document.createElement('div');

    // Create subform container
    const subform2 = document.createElement('div');
    subform2.className = 'element-sub-form';
    
    // Create and populate subform sections
    const subform_name2 = document.createElement('div');
    const subform_content2 = document.createElement('div');
    const subform_units2 = document.createElement('div');

    subform_name2.className = 'element-sub-form-name';
    subform_content2.className = 'element-sub-form-content';
    subform_units2.className = 'element-sub-form-units';

    subform_name.className = 'element-sub-form-name';
    subform_content.className = 'element-sub-form-content';
    subform_units.className = 'element-sub-form-units';

    // Add width input
    subform_name.innerHTML += '<div>Width:</div>';
    subform_content.innerHTML += `<div><input type="number" id="canvasWidth" value="${currentWidth}"></div>`;
    subform_units.innerHTML += '<div>px</div>';

    // Add height input
    subform_name2.innerHTML += '<div>Height:</div>';
    subform_content2.innerHTML += `<div><input type="number" id="canvasHeight" value="${currentHeight}"></div>`;
    subform_units2.innerHTML += '<div>px</div>';

    // Append sections to subform
    subform.appendChild(subform_name);
    subform.appendChild(subform_content);
    subform.appendChild(subform_units);
    subform2.appendChild(subform_name2);
    subform2.appendChild(subform_content2);
    subform2.appendChild(subform_units2);

    // Create update button
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update Canvas Size';
    updateButton.id = 'update-canvas-button';
    updateButton.type = 'button'; // Explicitly set type to 'button'

    // Append subform and button to main form
    form.appendChild(subform);
    form.appendChild(subform2);
    form.appendChild(updateButton);

    // Add event listener to the button
    document.getElementById('update-canvas-button').addEventListener('click', updateCanvas);

    // Show the popup
    popup.style.display = 'flex';
}

function updateCanvas(event) {
    event.preventDefault();

    let newWidth = parseInt(document.getElementById('canvasWidth').value);
    let newHeight = parseInt(document.getElementById('canvasHeight').value);
    let canvas = document.getElementById('defaultCanvas0');
    
    console.log('New width:', newWidth);
    console.log('New height:', newHeight);

    if (canvas) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        console.log('Canvas width after update:', canvas.width);
        console.log('Canvas height after update:', canvas.height);

        canvas.style.width = newWidth + 'px';
        canvas.style.height = newHeight + 'px';
        canvas.style.transform = 'none';
    }

    // If you're using p5.js, you might also need to call resizeCanvas
    if (typeof resizeCanvas === 'function') {
        resizeCanvas(newWidth, newHeight);
    }

    document.getElementById('element-popup').style.display = 'none';
    windowResized();
}


// function makeDraggable(element) {
//     let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
//     const header = document.createElement('div');
//     header.className = 'popup-header';
//     header.innerText = 'Drag Here';
//     element.prepend(header);

//     header.onmousedown = dragMouseDown;

//     function dragMouseDown(e) {
//         e.preventDefault();
//         pos3 = e.clientX;
//         pos4 = e.clientY;
//         document.onmouseup = closeDragElement;
//         document.onmousemove = elementDrag;
//     }

//     function elementDrag(e) {
//         e.preventDefault();
//         pos1 = pos3 - e.clientX;
//         pos2 = pos4 - e.clientY;
//         pos3 = e.clientX;
//         pos4 = e.clientY;
//         element.style.top = (element.offsetTop - pos2) + "px";
//         element.style.left = (element.offsetLeft - pos1) + "px";
//     }

//     function closeDragElement() {
//         document.onmouseup = null;
//         document.onmousemove = null;
//     }
// }


function closePopup() {
    document.getElementById('element-popup').style.display = 'none';
    selectedElement = null;
}

window.onclick = function(event) {
    const popup = document.getElementById('element-popup');
    if (event.target === popup) {
        closePopup();
    }
}

document.querySelector('.close').onclick = function() {
    closePopup();
}

//resizable left side

const leftContainer = document.getElementById('left-container');
const resizableHandle = document.getElementById('resizable-handle');
let isResizing = false;

resizableHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.style.cursor = 'ew-resize';
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
});

function resize(e) {
    if (!isResizing) return;
    const newWidth = e.clientX;
    leftContainer.style.width = `${newWidth}px`;
    const mainContainer = document.getElementById('main-container');
    mainContainer.style.width = `calc(100% - ${newWidth}px)`;
    windowResized();
}

function stopResize() {
    isResizing = false;
    document.body.style.cursor = 'default';
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
}

//resizeable handle horizontal
document.addEventListener('DOMContentLoaded', (event) => {
    const handleHorizontal = document.getElementById('resizable-handle-horizontal');
    const timelineContainer = document.getElementById('timeline-container');
    const canvasContainer = document.getElementById('canvas-container');

    let isResizingHorizontal = false;

    handleHorizontal.addEventListener('mousedown', function(e) {
        isResizingHorizontal = true;
        document.body.style.cursor = 'ns-resize';
        document.addEventListener('mousemove', resizeHorizontal, false);
        document.addEventListener('mouseup', stopResizeHorizontal, false);
    }, false);

    function resizeHorizontal(e) {
        if (!isResizingHorizontal) return;

        let timelineHeight = window.innerHeight - e.clientY;
        const containerHeight = document.getElementById('main-container').offsetHeight;

        // Ensure the new height is within the container's bounds
        if (timelineHeight < 50) timelineHeight = 50; // minimum height
        if (timelineHeight > containerHeight - 50) timelineHeight = containerHeight - 50; // maximum height

        timelineContainer.style.height = `${timelineHeight}px`;
        canvasContainer.style.height = `calc(${containerHeight-timelineHeight}px)`;
        windowResized();
    }

    function stopResizeHorizontal() {
        isResizingHorizontal = false;
        document.body.style.cursor = 'default';
        document.removeEventListener('mousemove', resizeHorizontal, false);
        document.removeEventListener('mouseup', stopResizeHorizontal, false);
    }
});

//canvas resizing 

function windowResized() {
    const container = document.getElementById('canvas-container');
    const canvas = document.getElementById('defaultCanvas0');
    const shortcuts = document.getElementById('shortcuts_under_canvas');

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const scaleWidth = containerWidth / canvas.width;
    const scaleHeight = (containerHeight - shortcuts.offsetHeight) / canvas.height;
    scale = Math.min(scaleWidth, scaleHeight); // Update the global scale variable

    canvas.style.transform = `scale(${scale})`;
    canvas.style.transformOrigin = 'top left';

    // Adjust canvas position to be centered
    const scaledCanvasWidth = canvas.width * scale;
    const scaledCanvasHeight = canvas.height * scale;

    const leftOffset = (containerWidth - scaledCanvasWidth) / 2;
    const topOffset = (containerHeight - scaledCanvasHeight - shortcuts.offsetHeight) / 2 + shortcuts.offsetHeight;

    canvas.style.left = `${leftOffset}px`;
    //canvas.style.top = `${topOffset}px`;

  }

//saving information

//include in final build

// function saveToExcel() {
//     const state = {
//         clickCount,
//         tracks: tracks.map(track => track.map(element => {
//             return {
//                 type: element.constructor.name.toLowerCase(),
//                 ...element
//             };
//         }))
//     };

//     const workbook = XLSX.utils.book_new();

//     // Create a sheet for clickCount
//     const clickCountSheet = XLSX.utils.json_to_sheet([{ clickCount: state.clickCount }]);
//     XLSX.utils.book_append_sheet(workbook, clickCountSheet, 'ClickCount');

//     // Create a sheet for each track
//     state.tracks.forEach((track, index) => {
//         const sheetData = [];
//         track.forEach(element => {
//             const elementData = [];
//             for (const [key, value] of Object.entries(element)) {
//                 if (typeof value === 'object' && value !== null) {
//                     elementData.push([key, JSON.stringify(value)]);
//                 } else {
//                     elementData.push([key, value]);
//                 }
//             }
//             sheetData.push(...elementData, []); // Empty array to create a space between elements
//         });
//         const sheet = XLSX.utils.aoa_to_sheet(sheetData);
//         XLSX.utils.book_append_sheet(workbook, sheet, `Track ${index + 1}`);
//     });

//     // Generate Excel file
//     XLSX.writeFile(workbook, 'animationState.xlsx');
// }

// function loadFromExcel(file) {
//     const reader = new FileReader();
//     reader.onload = function(e) {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });

//         const state = { tracks: [] };

//         // Read clickCount
//         const clickCountSheet = workbook.Sheets['ClickCount'];
//         const clickCountData = XLSX.utils.sheet_to_json(clickCountSheet)[0];
//         state.clickCount = clickCountData.clickCount;

//         // Read tracks
//         workbook.SheetNames.forEach(sheetName => {
//             if (sheetName.startsWith('Track ')) {
//                 const sheet = workbook.Sheets[sheetName];
//                 const trackData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//                 const track = [];
//                 let currentElement = {};

//                 trackData.forEach(row => {
//                     if (row.length === 0) {
//                         if (Object.keys(currentElement).length > 0) {
//                             track.push(currentElement);
//                             currentElement = {};
//                         }
//                     } else {
//                         const [key, value] = row;
//                         try {
//                             currentElement[key] = JSON.parse(value);
//                         } catch {
//                             currentElement[key] = value;
//                         }
//                     }
//                 });

//                 if (Object.keys(currentElement).length > 0) {
//                     track.push(currentElement);
//                 }

//                 state.tracks.push(track);
//             }
//         });

//         // Update the application state
//         clickCount = state.clickCount;
//         tracks = state.tracks.map(track => track.map(elementData => {
//             const elementType = elementData.type;
//             const ElementClass = elementRegistry[elementType].create(0).constructor;
//             return Object.assign(new ElementClass(), elementData);
//         }));
//         updateTimeline();
//     };
//     reader.readAsArrayBuffer(file);
// }

function saveState() {
    const state = {
        clickCount,
        tracks: tracks.map(track => track.map(element => {
            return {
                type: element.constructor.name.toLowerCase(),
                ...element
            };
        }))
    };
    const stateJSON = JSON.stringify(state);
    localStorage.setItem('animationState', stateJSON);
}


function loadState() {
    const stateJSON = localStorage.getItem('animationState');
    if (stateJSON) {
        const state = JSON.parse(stateJSON);
        clickCount = state.clickCount;
        tracks = state.tracks.map(track => track.map(elementData => {
            const elementType = elementData.type;
            console.log(elementType);
            const ElementClass = elementRegistry[elementType].create(0).constructor;
            return Object.assign(new ElementClass(), elementData);
        }));
        updateTimeline();
    }
}


function clearState() {
    localStorage.removeItem('animationState');
}


function saveToFile() {
    const state = {
        clickCount,
        tracks: tracks.map(track => track.map(element => {
            return {
                type: element.constructor.name.toLowerCase(),
                ...element
            };
        }))
    };
    const stateJSON = JSON.stringify(state);
    const blob = new Blob([stateJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'animationState.json';
    a.click();
    URL.revokeObjectURL(url);
}


document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const stateJSON = e.target.result;
            const state = JSON.parse(stateJSON);
            clickCount = state.clickCount;
            tracks = state.tracks.map(track => track.map(elementData => {
                const elementType = elementData.type;
                const ElementClass = elementRegistry[elementType].create(0).constructor;
                return Object.assign(new ElementClass(), elementData);
            }));
            updateTimeline();
        };
        reader.readAsText(file);
    }
});


document.getElementById('save-session').addEventListener('click', () => {
    saveState();
    alert('Session saved!');
});

document.getElementById('load-session').addEventListener('click', () => {
    loadState();
    alert('Session loaded!');
});

document.getElementById('clear-session').addEventListener('click', () => {
    clearState();
    alert('Session cleared!');
});

document.getElementById('download-session').addEventListener('click', () => {
    saveToFile();
});

document.getElementById('upload-session').addEventListener('click', () => {
    document.getElementById('file-input').click();
});

document.addEventListener('DOMContentLoaded', (event) => {
    const copyContentButton = document.getElementById('copy-content');
    if (copyContentButton) {
        console.log("Element found: copied");
        copyContentButton.addEventListener('click', () => {
            console.log("Icon clicked: copied");
        });
    }
});

//hotkeys configuration

function createKeyboardShortcut(key, callback, isDoublePress = false, doublePressDelay = 300) {
    let lastKeyPressTime = 0;
    let pressCount = 0;
  
    document.addEventListener('keydown', function(event) {
      if (event.key.toLowerCase() === key.toLowerCase()) {
        const currentTime = new Date().getTime();
  
        if (isDoublePress) {
          if (currentTime - lastKeyPressTime <= doublePressDelay) {
            pressCount++;
            if (pressCount === 2) {
              callback();
              pressCount = 0;
            }
          } else {
            pressCount = 1;
          }
          lastKeyPressTime = currentTime;
        } else {
          callback();
        }
      }
    });
  }



  document.addEventListener('DOMContentLoaded', function() {
    // Double-press 'A' shortcut
    createKeyboardShortcut('A', function() {
      document.getElementById('free-click-button').click();
    }, true);
  
    //add more shortcuts in future

  });

//other functions


//slider update


//aligning box under canvas


addTrack();
updateTimeline();