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
            content: `<strong>Acute Gastroenteritis</strong>
                      <li>This is typically a temporary condition and should improve with proper treatment and care.</li>`
        },{
            title:"Physical Examination Results",
            content:`
                <p>There is some mild tenderness and increased bowel sounds, which are common with gastroenteritis. However, there is no rebound tenderness or distension, which suggests there are no serious complications like bowel obstruction.</p>
            `
        },
        {
            title: "Overall Health",
            content: `
                    Based on the examination, your vital signs such as temperature, blood pressure, heart rate, and respiratory rate are within the normal range. 
                    This indicates that your body is coping well with the illness. There are no signs of severe dehydration, and your oral mucosa and skin turgor are normal, which is a positive sign.
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
