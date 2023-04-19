window.onload = function () {
    let slider = document.getElementById("inputSize");
    let output = document.getElementById("inputSizeValue");
    output.innerHTML = slider.value;

    slider.oninput = function () {
        output.innerHTML = this.value;
    }
}

function display(arrayFormId) {
    let arrayForm = document.getElementById(arrayFormId);
    if (arrayForm.style.display === "none") {
        arrayForm.style.display = "block";
    } else {
        arrayForm.style.display = "none";
    }
}

function runAlgorithm(page, arrayFormId, arraySizeFormId, errorBoxId, errorTextId, displayBoxId, displayTextId, unsortedArrayTextID, sortedArrayTextId, sortedArrayStepId) {
    // Reset error box display.
    var algorithmType = null;
    var radioButton = document.getElementsByName('algoSelect');
    for (i = 0; i < radioButton.length; i++) {
        if (radioButton[i].checked) {
            algorithmType = radioButton[i].value;
        }
    }
    document.getElementById(errorBoxId).style.display = "none";

    // Read text from array form.
    const arrayFormValue = document.getElementById(arrayFormId).value.split(",");

    // Read integer from size form.
    let arraySize = parseInt(document.getElementById(arraySizeFormId).value);

    // Convert array form text to an array of integers.
    let array = arrayFormValue.slice(0, arraySize).map(x => parseInt(x));

    // Compare array size to user size input.
    if (arrayFormValue.length != arraySize) {
        let errorBox = document.getElementById(errorBoxId);
        errorBox.style.display = "block";

        if (arrayFormValue.length > arraySize) {
            document.getElementById(errorTextId).innerHTML = "Received more entries than expected (Expected: " + arraySize + ", Received: " + arrayFormValue.length + ") <br>Will only sort the first " + arraySize + " entries.<br>";
        } else if (arrayFormValue.length < arraySize) {
            document.getElementById(errorTextId).innerHTML = "Received less entries than expected (Expected: " + arraySize + ", Received: " + arrayFormValue.length + ") <br>Will sort the given entries.<br>";
            arraySize = arrayFormValue.length;
        }
    }

    let displayBox = document.getElementById(displayBoxId);
    let displayText = document.getElementById(displayTextId);
    if (displayBox.style.display === "none") {
        displayBox.style.display = "block";
        displayText.style.display = "block";
    } else {
        displayBox.style.display = "none";
        displayText.style.display = "none";
    }
    document.getElementById(unsortedArrayTextID).innerHTML = array;

    let algorithmArray = null;
    switch (algorithmType) {
        case "bubble":
            algorithmArray = bubbleSort(array, arraySize, sortedArrayTextId, sortedArrayStepId);
            break;
        case "merge":
            algorithmArray = mergeSort(array, sortedArrayTextId, sortedArrayStepId);
            break;
            // changed the name from kadane to be more representaive of the algo
            //should alter the function name as well
        case "naiveMaxSum":
            algorithmArray = naiveMaxSum(array, sortedArrayStepId);
            break;
        default:
            document.getElementById(errorTextId).innerHTML = "Please select an algorithm.";
            document.getElementById(errorBoxId).style.display = "block";
            break;
    }

    switch (page) {
        case "thirdHighest":
            document.getElementById("thirdLargestPrint").innerHTML = algorithmArray[algorithmArray.length - 3];
            break;
        case "naiveMaxSum":
            document.getElementById("MaxSumPrint").innerHTML = algorithmArray;
    }

    document.getElementById(sortedArrayTextId).innerHTML = algorithmArray;
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

    return array;
}
//for step output
let stepIndex = 1;

// Merge Sort Algorithm - O(nlogn)
function mergeSort(array, sortedArrayTextId, sortedArrayStepId) {
    if (array.length <= 1) {
        return array;
    }

    let middleIndex = Math.floor(array.length / 2);
    let leftArray = array.splice(0, middleIndex);

    return merge(mergeSort(leftArray, sortedArrayTextId, sortedArrayStepId), mergeSort(array, sortedArrayTextId, sortedArrayStepId), sortedArrayTextId, sortedArrayStepId);
}

let stepsText = "";

function merge(leftArray, rightArray, sortedArrayTextId, sortedArrayStepId) {
    let array = []
    // let stepsText = "";
    let index = 1;
    stepsText += stepIndex + ".) Left: " + leftArray + " Right: " + rightArray + " Merge: ";

    while (leftArray.length && rightArray.length) {
        if (leftArray[0] < rightArray[0]) {
            array.push(leftArray.shift());
        } else {
            array.push(rightArray.shift());
        }

        let intermediateArray = [...array, ...leftArray, ...rightArray];
        // stepsText += index + ".) " + intermediateArray + "<br>";
        // index += 1;
    }
    array = [...array, ...leftArray, ...rightArray];

    // stepsText +=  + intermediateArray + "<br>";
    for (let i = 0; array.length > i; i++) {
        stepsText += array[i] + " ";
    }
    stepsText += "<br>";


    document.getElementById(sortedArrayTextId).innerHTML = array;
    document.getElementById(sortedArrayStepId).innerHTML = stepsText;
    stepIndex += 1;

    return array;
}

// Kadane's Algorithm
function naiveMaxSum(array, arrayStepId) {
    var maxSubarraySum = Number.MIN_VALUE;
    var maxSubarrayElements = [];
    let stepsIndex = 1;
    let stepsText = ""

    for (let i = 0; i < array.length; i++) {
        let currentSubarraySum = 0;
        let currentSubarrayElements = [];
        
        for (let j = i; j < array.length; j++) {
            currentSubarrayElements.push(array[j]);
            currentSubarraySum += array[j];

            if (currentSubarraySum > maxSubarraySum) {
                maxSubarraySum = currentSubarraySum;
                maxSubarrayElements = currentSubarrayElements;
                stepsText += stepsIndex + ".) Maximum Contiguous Sum: " + maxSubarraySum + "<br>";
            }
            stepsIndex += 1;
        }
    }

    document.getElementById(arrayStepId).innerHTML = stepsText;

    return maxSubarrayElements;
}