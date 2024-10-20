document.addEventListener("DOMContentLoaded", function() {
    const container = document.createElement('div');
    container.classList.add('card-container');

    const cardData = [
        {
            title: "Patient Information",
            content: `
                <p><strong>Name:</strong> XXXXX</p>
                <p><strong>Age:</strong> 25</p>
                <p><strong>Gender:</strong> male</p>
            `
        },
        {
            title: "History",
            content: `
                <p>The patient has no known food allergies and no recent changes in diet.</p>
                <p>There is [no/recent] history of travel and no known contact with sick individuals.</p>
                <p>No chronic illnesses, and the patient denies taking any new medications.</p>
            `
        },
        {
            title: "Physical Examination",
            content: `
                <p><strong>Vital Signs:</strong></p>
                <ul>
                    <li>Temperature: 1000</li>
                    <li>Blood Pressure: 1000</li>
                    <li>Heart Rate: 100/min</li>
                    <li>Respiratory Rate: 6/min</li>
                </ul>
                <p><strong>Abdominal Examination:</strong></p>
                <p>Increased bowel sounds and mild tenderness upon palpation, no rebound tenderness.</p>
                <p>Other Findings: No signs of dehydration, oral mucosa is moist, skin turgor is normal.</p>
            `
        },
        {
            title: "Diagnosis",
            content: `<p>Acute Gastroenteritis</p>`
        },
        {
            title: "Recommendations",
            content: `
                <ul>
                    <li><strong>Hydration:</strong> Encourage the patient to drink plenty of fluids.</li>
                    <li><strong>Diet:</strong> Recommend bland foods such as rice, toast, and bananas.</li>
                    <li><strong>Rest:</strong> Advise the patient to rest and avoid strenuous activities.</li>
                </ul>
            `
        }
    ];

    cardData.forEach(data => {
        const card = document.createElement('div');
        card.classList.add('card');

        const cardTitle = document.createElement('h3');
        cardTitle.innerHTML = data.title;
        card.appendChild(cardTitle);

        const cardContent = document.createElement('div');
        cardContent.innerHTML = data.content;
        card.appendChild(cardContent);

        container.appendChild(card);
    });

    document.body.appendChild(container);
});
