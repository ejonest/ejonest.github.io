function display(arrayFormId) {
    let arrayForm = document.getElementById(arrayFormId);
    if (arrayForm.style.display === "none") {
        arrayForm.style.display = "block";
    } else {
        arrayForm.style.hidden = "none";
    }
}

function runAlgorithm(arrayFormId, arraySizeFormId, errorBoxId, errorTextId, displayBoxId, displayTextId, unsortedArrayTextID, sortedArrayTextId, sortedArrayStepId) {
    // Read text from array form.
    const arrayFormValue = document.getElementById(arrayFormId).value.split(" ");

    // Read integer from size form.
    let arraySize = parseInt(document.getElementById(arraySizeFormId).value);

    // Convert array form text to an array of integers.
    let array = arrayFormValue.slice(0, arraySize).map(x => parseInt(x));

    // Compare array size to user size input.
    if (arrayFormValue.length != arraySize) {
        let errorBox = document.getElementById(errorBoxId);
        errorBox.style.display = "block";

        if (arrayFormValue.length > arraySize) {
            document.getElementById(errorTextId).innerHTML = "Too many entries. Will only sort the first " + arraySize + " entries.<br>";
        } else if (arrayFormValue.length < arraySize) {
            document.getElementById(errorTextId).innerHTML = "Too few entries. Expected " + arraySize + ". Received " + arrayFormValue.length + ". Will sort what you have entered.<br>";
            arraySize = arrayFormValue.length;
        }
    }

    let displayBox = document.getElementById(displayBoxId);
    let displayText = document.getElementById(displayTextId);
    if (displayBox.style.display === "none") {
        displayBox.style.display = "block";
        displayText.style.display = "block";
    } else {
        displayBox.style.hidden = "none";
        displayText.style.hidden = "none";
    }
    document.getElementById(unsortedArrayTextID).innerHTML = array;

    if (document.getElementById('bubble').checked) {
        sorted = bubbleSort(array, array.length, sortedArrayTextId, sortedArrayStepId);
    } else {
        sorted = mergeSort(array, sortedArrayTextId, sortedArrayStepId);
    }
    
}

// Bubble Sort Algorithm - O(n^2)
function bubbleSort(array, arraySize, sortedArrayTextId, sortedArrayStepId) {
    let stepsText = "";
    let index = 1;
    for (let i = 0; i < arraySize; i++) {
        for (let j = 0; j < (arraySize - 1 - i); j++) {
            if (array[j] > array[j + 1]) {
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            }
            stepsText += index + ".) " + array + "<br>";
            index += 1;
        }
    }
    document.getElementById(sortedArrayTextId).innerHTML = array;
    document.getElementById(sortedArrayStepId).innerHTML = stepsText;
}

// Merge Sort Algorithm - O(nlogn)
function mergeSort(array, sortedArrayTextId, sortedArrayStepId) {
    if (array.length <= 1) {
        return array;
    }

    let middleIndex = Math.floor(array.length / 2);
    let leftArray = array.splice(0, middleIndex);

    return merge(mergeSort(leftArray, sortedArrayTextId, sortedArrayStepId), mergeSort(array, sortedArrayTextId, sortedArrayStepId), sortedArrayTextId, sortedArrayStepId);
}

function merge(leftArray, rightArray, sortedArrayTextId, sortedArrayStepId) {
    let array = []
    let stepsText = "";
    let index = 1;

    while (leftArray.length && rightArray.length) {
        if (leftArray[0] < rightArray[0]) {
            array.push(leftArray.shift());
        } else {
            array.push(rightArray.shift());
        }

        let intermediateArray = [...array, ...leftArray, ...rightArray];
        stepsText += index + ".) " + intermediateArray + "<br>";
        index += 1;
    }

    array = [...array, ...leftArray, ...rightArray];

    document.getElementById(sortedArrayTextId).innerHTML = array;
    document.getElementById(sortedArrayStepId).innerHTML = stepsText;
    
    return array;
}