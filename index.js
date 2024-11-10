
const toggleButton = document.querySelector('button[type="button"]');


const imperialElements = document.querySelectorAll('.Imperial');
const metricElements = document.querySelectorAll('.metric');
const resultsElements = document.querySelectorAll('.results')
const explainingElements = document.querySelectorAll('.explaining')


resultsElements.forEach(element => element.style.display = 'none');
explainingElements.forEach(element => element.style.display = 'none');


let isImperial = true;
imperialElements.forEach(element => element.style.display = 'block');
metricElements.forEach(element => element.style.display = 'none');

// Function to toggle visibility
function toggleMeasurementUnits() {
    // Check the current state and toggle accordingly
    if (isImperial) {
        // Hide Imperial, show metric
        imperialElements.forEach(element => element.style.display = 'none');
        metricElements.forEach(element => element.style.display = 'block');
    } else {
        // Show Imperial, hide metric
        imperialElements.forEach(element => element.style.display = 'block');
        metricElements.forEach(element => element.style.display = 'none');
    }
    // Flip the state
    isImperial = !isImperial;
}

toggleButton.addEventListener('click', toggleMeasurementUnits);


const calculateButton = document.querySelector('.databutton');


function validateForm() {
    // Select all required fields
    const ageInput = document.getElementById('Ageenter');
    const weightLbsInput = document.getElementById('Weightenterpnds');
    const weightKgsInput = document.getElementById('Weightenterkgs');
    const heightFtInput = document.getElementById('HeightFtenter');
    const heightInInput = document.getElementById('HeightInenter');
    const heightCmInput = document.getElementById('HeightCMenter');
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    const activityInputs = document.querySelectorAll('input[name="activity"]');
    const goalInputs = document.querySelectorAll('input[name="goal"]');

    // Initialize an empty array to store missing fields
    const missingFields = [];

    // Check each field for required data
    if (!ageInput.value) missingFields.push('Age');
    if (!(weightLbsInput.value || weightKgsInput.value)) missingFields.push('Weight');
    if (!(heightFtInput.value && heightInInput.value) && !heightCmInput.value) missingFields.push('Height');

    // Check if any radio groups are unchecked
    if (![...genderInputs].some(input => input.checked)) missingFields.push('Gender');
    if (![...activityInputs].some(input => input.checked)) missingFields.push('Activity Level');
    if (![...goalInputs].some(input => input.checked)) missingFields.push('Goal');

    // Show an error if there are missing fields
    if (missingFields.length > 0) {
        alert(`Please fill out the following fields: ${missingFields.join(', ')}`);
        return false;
    }

    // If no fields are missing, proceed with calculation
    return true;
}


function calculateTDEE() {
    // Retrieve the values from each input field
    const age = parseInt(document.getElementById('Ageenter').value);
    const weightLbs = parseFloat(document.getElementById('Weightenterpnds').value);
    const weightKgs = parseFloat(document.getElementById('Weightenterkgs').value);
    const heightFt = parseFloat(document.getElementById('HeightFtenter').value);
    const heightIn = parseFloat(document.getElementById('HeightInenter').value);
    const heightCm = parseFloat(document.getElementById('HeightCMenter').value);
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const activity = document.querySelector('input[name="activity"]:checked').value;
    const goal = document.querySelector('input[name="goal"]:checked').value;

    
    const weight = weightKgs || (weightLbs * 0.453592); // Convert lbs to kg if lbs is used
    const height = heightCm || (heightFt * 30.48 + heightIn * 2.54); // Convert ft and in to cm if used

    // Log the gathered values for debugging purposes
    console.log("Age:", age);
    console.log("Weight (kg):", weight);
    console.log("Height (cm):", height);
    console.log("Gender:", gender);
    console.log("Activity Level:", activity);
    console.log("Goal:", goal);

    let tdee = 0;
    //Basal Energy Expenditure equation from http://www-users.med.cornell.edu/
    if(gender == "male"){
        tdee = 66.5 + (13.75 * weight) + (5.003 * height) - (6.775 * age)
    }else{
        tdee = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age)
    }
    
    let mult = 1;
    switch(activity){
        case "sedentary": 
            mult = 1.0;
            break;
        case "light":
            mult = 1.275;
            break;
        case "moderate": 
            mult = 1.45;
            break;
        case "very":
            mult = 1.625;
            break;
    }
    let tdeeAfter = tdee * mult;
    let tdeeFinal = tdeeAfter
    switch(goal){
        case "gain": 
            tdeeFinal = tdeeFinal * 1.15;
            break;
        case "maintain":
            tdeeFinal = tdeeFinal * 1.0;
            break;
        case "lose": 
            tdeeFinal = tdeeFinal * .85;
            break;
    }
    let protein = 2.4 * weight; 
    let fat = (tdeeFinal * .25) / 9;
    let carbs = (tdeeFinal - ((protein * 4) + (fat * 9))) / 4;


    
    console.log("TDEE (calculated):", tdee);

    
    document.querySelector('tr:nth-child(2) th:nth-child(2)').textContent = `${Math.round(tdeeFinal)} Cal`;
    document.querySelector('tr:nth-child(3) th:nth-child(2)').textContent = `${Math.round(protein)} Grams`;
    document.querySelector('tr:nth-child(4) th:nth-child(2)').textContent = `${Math.round(fat)} Grams`;
    document.querySelector('tr:nth-child(5) th:nth-child(2)').textContent = `${Math.round(carbs)} Grams`;

    document.getElementById("Explanation").innerHTML = `First we take your age, weight, and sex and plug it into the Basal Metabolic rate equation (Harris–Benedict equation) to get our initial caloric maintenence needs (which for you is ${Math.round(tdee)}). Then multiply that by the activity ratio (1.2 to 2) to get our total daily expenditure; TDEE (Yours is ${Math.round(tdeeAfter)}). Then depending on our goals we alter the tdee with an increase, decrease, or stay unchanged of 15 percent depending on what we want (you got ${Math.round(tdeeFinal)}) and finally convert our macros based of our final TDEE (Protein based on our weight, fat being 20 percent of the toal calories, and carbs being the rest)`;
}


calculateButton.addEventListener('click', (event) => {
    event.preventDefault(); 

    
    if (validateForm()) {
        calculateTDEE();
        resultsElements.forEach(element => element.style.display = 'block');
        explainingElements.forEach(element => element.style.display = 'block')
    }
});
