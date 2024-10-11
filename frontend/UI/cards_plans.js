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
            title: "Diagnosis",
            content: `<p>Acute Gastroenteritis</p>`
        },
        {
            title: "Medication Plan",
            content: `
                    <strong>Medication: Amoxicillin</strong> 
                        <li> Dosage: 500 mg </li>
                        <li> Administration: Orally, every 8 hours </li>
                        <li> Duration: For 7 consecutive days </li>
            `
        },
        {
            title:"Follow-up",
            content:`
                <p>Schedule a follow-up after 7 days or if symptoms do not improve. 
                        Contact the doctor sooner if adverse reactions or discomfort occur during the medication period.</p>
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
