// Function to display messages in a custom modal instead of alert()
function showModalMessage(message) {
    const modal = document.getElementById('messageModal');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = message;
    modal.classList.remove('hidden');
    document.getElementById('modalCloseBtn').onclick = () => {
        modal.classList.add('hidden');
    };
}

// Define unit sizes for each material type
const unitSizes = {
    resins: [320, 160, 80, 40],
    metals: [400, 200, 100, 50],
    ceramics: [320, 160, 80, 40],
    chemicals: [240, 120, 60, 30],
    specialAlloys: [480, 240, 120, 60]
};

// Function to calculate units for a given material
function calculateUnits(totalAmount, sizes) {
    let remaining = totalAmount;
    const unitsBreakdown = {}; // Object to store the count for each unit size

    // Iterate through sizes from largest to smallest (assuming sizes are sorted descending)
    for (const size of sizes) {
        if (remaining >= size) {
            const count = Math.floor(remaining / size); // Number of units of this size
            unitsBreakdown[size] = count; // Store the count
            remaining -= count * size; // Subtract the amount covered by these units
        } else {
            unitsBreakdown[size] = 0; // If current size is too large, 0 units of this size
        }
    }
    return { units: unitsBreakdown, remaining: remaining };
}

// Function to format the results for display
function formatResults(materialDisplayName, result) {
    // Map display names to the actual keys in unitSizes to ensure correct lookup
    const keyMap = {
        "Resins": "resins",
        "Metals": "metals",
        "Ceramics": "ceramics",
        "Chemicals": "chemicals",
        "Special Alloys": "specialAlloys"
    };
    const materialKey = keyMap[materialDisplayName]; // Get the correct key

    if (!materialKey || !unitSizes[materialKey]) {
        console.error(`Invalid material name or missing unit sizes: ${materialDisplayName}`);
        return `<p class="text-red-600">Error: Could not retrieve unit sizes for ${materialDisplayName}.</p>`;
    }

    let output = `<p class="text-lg font-semibold text-gray-800">${materialDisplayName} Units:</p>`;
    let hasUnits = false;
    // Iterate through the unit sizes defined for the material to ensure order
    const sizesForMaterial = unitSizes[materialKey]; // Use the correct key here

    for (const size of sizesForMaterial) {
        const count = result.units[size] || 0; // Get count, default to 0 if not present
        if (count > 0) {
            output += `<p class="text-gray-700 ml-4">${count} x ${size} units</p>`;
            hasUnits = true;
        }
    }

    if (!hasUnits) {
        output += `<p class="text-gray-700 ml-4">No units needed (or total is 0).</p>`;
    }

    if (result.remaining > 0) {
        output += `<p class="text-red-600 ml-4 font-semibold">Remaining: ${result.remaining} units (cannot be perfectly fit by available unit sizes).</p>`;
    }
    return output;
}

// Function to reset all inputs and results
function resetCalculator() {
    document.getElementById('resins').value = '';
    document.getElementById('metals').value = '';
    document.getElementById('ceramics').value = '';
    document.getElementById('chemicals').value = '';
    document.getElementById('specialAlloys').value = '';

    const resultDivs = [
        document.getElementById('resinsResult'),
        document.getElementById('metalsResult'),
        document.getElementById('ceramicsResult'),
        document.getElementById('chemicalsResult'),
        document.getElementById('specialAlloysResult')
    ];

    resultDivs.forEach(div => {
        div.innerHTML = ''; // Clear content
        div.classList.add('hidden'); // Hide the div
    });
}


// Main calculation function
document.getElementById('calculateBtn').addEventListener('click', () => {
    const resinsInput = parseInt(document.getElementById('resins').value) || 0;
    const metalsInput = parseInt(document.getElementById('metals').value) || 0;
    const ceramicsInput = parseInt(document.getElementById('ceramics').value) || 0;
    const chemicalsInput = parseInt(document.getElementById('chemicals').value) || 0;
    const specialAlloysInput = parseInt(document.getElementById('specialAlloys').value) || 0;

    // Get result display elements
    const resinsResultDiv = document.getElementById('resinsResult');
    const metalsResultDiv = document.getElementById('metalsResult');
    const ceramicsResultDiv = document.getElementById('ceramicsResult');
    const chemicalsResultDiv = document.getElementById('chemicalsResult');
    const specialAlloysResultDiv = document.getElementById('specialAlloysResult');

    // Hide all results initially
    [resinsResultDiv, metalsResultDiv, ceramicsResultDiv, chemicalsResultDiv, specialAlloysResultDiv].forEach(div => div.classList.add('hidden'));

    // Perform calculations
    const resinsCalc = calculateUnits(resinsInput, unitSizes.resins);
    const metalsCalc = calculateUnits(metalsInput, unitSizes.metals);
    const ceramicsCalc = calculateUnits(ceramicsInput, unitSizes.ceramics);
    const chemicalsCalc = calculateUnits(chemicalsInput, unitSizes.chemicals);
    const specialAlloysCalc = calculateUnits(specialAlloysInput, unitSizes.specialAlloys);

    // Display results for each material if input > 0 or if there's a remaining amount
    if (resinsInput > 0 || resinsCalc.remaining > 0) {
        resinsResultDiv.innerHTML = formatResults("Resins", resinsCalc);
        resinsResultDiv.classList.remove('hidden');
    }
    if (metalsInput > 0 || metalsCalc.remaining > 0) {
        metalsResultDiv.innerHTML = formatResults("Metals", metalsCalc);
        metalsResultDiv.classList.remove('hidden');
    }
    if (ceramicsInput > 0 || ceramicsCalc.remaining > 0) {
        ceramicsResultDiv.innerHTML = formatResults("Ceramics", ceramicsCalc);
        ceramicsResultDiv.classList.remove('hidden');
    }
    if (chemicalsInput > 0 || chemicalsCalc.remaining > 0) {
        chemicalsResultDiv.innerHTML = formatResults("Chemicals", chemicalsCalc);
        chemicalsResultDiv.classList.remove('hidden');
    }
    if (specialAlloysInput > 0 || specialAlloysCalc.remaining > 0) {
        specialAlloysResultDiv.innerHTML = formatResults("Special Alloys", specialAlloysCalc);
        specialAlloysResultDiv.classList.remove('hidden');
    }

    // If no input was provided for any field, show a message
    if (resinsInput === 0 && metalsInput === 0 && ceramicsInput === 0 && chemicalsInput === 0 && specialAlloysInput === 0) {
        showModalMessage("Please enter an amount for at least one material to calculate units.");
    }
});

// Event listener for the new reset button
document.getElementById('resetBtn').addEventListener('click', resetCalculator);
