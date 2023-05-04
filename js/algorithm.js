window.onload = function () {
    let slider = document.getElementById("array-size-slider");
    let sliderValue = document.getElementById("array-size-value");
    sliderValue.innerHTML = slider.value;

    slider.oninput = function () {
        sliderValue.innerHTML = this.value;
    }
}

function runAlgorithm(page) {
    // Reset error div.
    document.getElementById("error-div").style.display = "none";

    // Retrieve algorithm type.
    let algorithmOptions = document.getElementsByName("algorithm-option");
    let algorithmType = null;
    for (let i = 0; i < algorithmOptions.length; i++) {
        if (algorithmOptions[i].checked) {
            algorithmType = algorithmOptions[i].value;
            break;
        }
    }

    // Check if no algorithm is selected.
    if (algorithmType == null) {
        logError("Please select an algorithm.");
        return;
    }

    // Retrieve array input.
    // let array = document.getElementById("array-input").value
    const array = [];
    var inputNums = document.getElementById("array-input").value;
    const textArray = inputNums.split(",");
    for (let i = 0; i < textArray.length; i++) {
        array[i] = parseInt(textArray[i]);
    }

    // Validate array input.
    let isValidInput = /^-?\d+($|,-?\d+)*$/.test(array);

    if (!isValidInput) {
        logError("Invalid input. Please enter only numbers separated by commas.");
        return;
    }
    // array = array.split(",");

    // Retrieve array size.
    let arraySize = document.getElementById("array-size-slider").value;
    // Compare array size to user size input.
    if (array.length != arraySize) {
        logError("Invalid input. Enter only " + arraySize + " numbers separated by commas.");
        return;
    }

    // Start performance timer.
    let time = null;
    let startTime = performance.now();
    let endTime = null;

    // Run algorithm.
    let result = null;
    let duplicateCheck = null;
    let maxSumFormatted = "";

    console.log(array);
    switch (algorithmType) {
        case "bubbleSort":
            result = bubbleSort(array);

            document.getElementById("output-text-2").innerHTML = array;
            document.getElementById("output-text-3").innerHTML = result;
            break;
        case "mergeSort":
            mergeSortIndex = 1;
            mergeSortSteps = "";
            let arrayCopy = array.slice();
            result = mergeSort(array);

            if (page == "thirdLargest") {
                document.getElementById("output-text-2").innerHTML = result[result.length - 3];
            }
            else {
                document.getElementById("output-text-2").innerHTML = arrayCopy;
                document.getElementById("output-text-3").innerHTML = result;
            }

            break;
        case "threeVariable":
            duplicateCheck = new Set(array);
            if (duplicateCheck.size != array.length) {
                logError("Invalid input. Please enter only unique numbers.");
                return;
            }

            result = threeVariable(array);
            document.getElementById("output-text-2").innerHTML = result;
            break;
        case "naiveMaxSum":
            duplicateCheck = new Set(array);
            if ((duplicateCheck.size != array.length) || array.some(number => number < 0)) {
                logError("Invalid input. Please enter only unique positive numbers.");
                return;
            }

            result = naiveMaxSum(array);
            maxSumFormatted = "(0, " + (result.length - 1) + "): " + result;
            document.getElementById("output-text-2").innerHTML = maxSumFormatted;

            break;
        case "kadaneMaxSum":
            result = kadaneMaxSum(array);

            maxSumFormatted = "(";
            maxSumFormatted += result[result.length - 2] + ", " + result[result.length - 1] + "): ";
            result.pop();
            result.pop();
            maxSumFormatted += result;

            document.getElementById("output-text-2").innerHTML = maxSumFormatted;

            break;
    }

    // End performance timer.
    endTime = performance.now();
    time = (endTime - startTime) * 1000;
    document.getElementById("output-text-1").innerHTML = time + " μs";

    // Display results.
    document.getElementById("output-div").style.display = "block";
    document.getElementById("steps-div").style.display = "block";
}

function logError(message) {
    document.getElementById("error-text").innerHTML = message;
    document.getElementById("error-div").style.display = "block";
    document.getElementById("output-div").style.display = "none";
    document.getElementById("steps-div").style.display = "none";
}

// Bubble Sort Algorithm
function bubbleSort(array) {
    let sorted = array.slice();
    let steps = "";
    let index = 1;

    for (let i = 0; i < sorted.length; i++) {
        for (let j = 0; j < (sorted.length - i - 1); j++) {
            if (sorted[j] > sorted[j + 1]) {
                let temp = sorted[j];
                sorted[j] = sorted[j + 1];
                sorted[j + 1] = temp;
            }
            steps += index + ".) " + sorted + "<br><br>";
            index += 1;
        }
    }

    document.getElementById("steps-text").innerHTML = steps;

    return sorted;
}

// Merge Sort Algorithm
let mergeSortIndex = 1;
let mergeSortSteps = "";

function mergeSort(array) {
    if (array.length <= 1) {
        return array;
    }

    let middleIndex = Math.floor(array.length / 2);
    let leftArray = array.splice(0, middleIndex);

    return mergeSortHelper(mergeSort(leftArray), mergeSort(array));
}

function mergeSortHelper(leftArray, rightArray) {
    let sorted = []
    mergeSortSteps += mergeSortIndex + ".) Left: " + leftArray + " Right: " + rightArray + " Merge: ";

    while (leftArray.length && rightArray.length) {
        if (leftArray[0] < rightArray[0]) {
            sorted.push(leftArray.shift());
        } else {
            sorted.push(rightArray.shift());
        }
    }
    sorted = [...sorted, ...leftArray, ...rightArray];

    for (let i = 0; sorted.length > i; i++) {
        mergeSortSteps += sorted[i] + " ";
    }
    mergeSortSteps += "<br><br>";

    document.getElementById("steps-text").innerHTML = mergeSortSteps;
    mergeSortIndex += 1;

    return sorted;
}

// Three Variable Algorithm
function threeVariable(array) {
    let largest = Number.MIN_VALUE;
    let secondLargest = Number.MIN_VALUE;
    let thirdLargest = Number.MIN_VALUE;

    let steps = "";
    let index = 1;

    for (let i = 0; i < array.length; i++) {
        if (largest != Number.MIN_VALUE) {
            steps += index + ".) Current: " + array[i] + "<br> Largest: " + largest + "<br>";
        } else {
            steps += index + ".) Current: " + array[i] + "<br> Largest: NaN <br>";
        }
        if (secondLargest != Number.MIN_VALUE) {
            steps += " Second Largest: " + secondLargest + "<br>";
        } else {
            steps += " Second Largest: NaN <br>";
        }
        if (thirdLargest != Number.MIN_VALUE) {
            steps += " Third Largest: " + thirdLargest + "<br><br>";
        } else {
            steps += " Third Largest: NaN <br><br>";
        }
        if (i == 0) {
            largest = array[i];
        } else if (array[i] > largest) {
            thirdLargest = secondLargest;
            secondLargest = largest;
            largest = array[i];
        } else if (array[i] > secondLargest) {
            thirdLargest = secondLargest;
            secondLargest = array[i];
        } else if (array[i] > thirdLargest) {
            thirdLargest = array[i];
        } else if (secondLargest == Number.MIN_VALUE) {
            secondLargest = array[i];
        } else if (thirdLargest == Number.MIN_VALUE) {
            thirdLargest == array[i];
        }

        index += 1;
    }

    document.getElementById("steps-text").innerHTML = steps;

    return thirdLargest;
}

// Naive Max Sum Algorithm
function naiveMaxSum(array) {
    var maxArray = [];
    // array = [87,8,7];
    let maxSum = array[0];
    let tempSum = 0;
    let end = 0;
    let begin = 0;

    let steps = "";
    let index = 1;

    for (let i = 0; i < array.length; ++i) {
        let tempArray = [];
        for (let j = i; j < array.length; ++j) {
            tempSum += array[j];
            tempArray.push(array[j]);
            if (tempSum > maxSum) {
                end = i;
                begin = j;
                maxSum = tempSum;
            }
            steps += index + ".) Maximum Contiguous Sum: " + maxSum + "<br>" +
                /*"Max Array: " + maxArray + " || */ "Current Array: " + tempArray + "<br><br>";
            index += 1;
        }
        tempSum = 0;
    }

    for (let i = end; i <= begin; ++i) {
        maxArray.push(array[i]);
    }

    document.getElementById("steps-text").innerHTML = steps;

    return maxArray;
}

// Kadane's Max Sum Algorithm
function kadaneMaxSum(array) {
    // array = [87,8,7];
    let maxArray = [];
    let maxSoFar = array[0];
    let maxEndingHere = 0;
    let end = 0;
    let begin = 0;

    let steps = "";
    let index = 1;

    if (maxSoFar > 0) {end = 1;}
    for (var i = 0; i < array.length; i++) {
        maxEndingHere = maxEndingHere + array[i];
        // print("MEH: " + maxEndingHere);
        // print("MSF: " + maxSoFar);
        // print();
        if (maxSoFar < maxEndingHere) {
            maxSoFar = maxEndingHere;
            end = i + 1;
        }

        if (maxEndingHere < 0) {
            // maxEndingHere = 0;
            // b = i + 1;
            if (array[i] < 0 && maxSoFar < 0) {
                begin = i + 1;
                maxEndingHere = 0;
            }
        }

        var tempArray = array.slice(0, i+1);
        steps += index + ".) Maximum Contiguous Sum: " + maxSoFar + "<br>" + "Current Array: " + tempArray + "<br><br>";
        index += 1;
    }

    // // Get maxArray
    // maxArray = array.slice(b, e);
    if (maxEndingHere == 0) {
        // maxArray = [0];
        begin = 0;
        end = 0;
        maxArray.push(0);
        maxArray.push(begin);
        maxArray.push(end);
    } else {
        // Get maxArray
        maxArray.push(array.slice(begin, end));
        // maxArray = array.slice(b, e);
        end -= 1;
        maxArray.push(begin);
        maxArray.push(end);
    }
    // Print steps to the console
    document.getElementById("steps-text").innerHTML = steps;
    
    return maxArray;
}