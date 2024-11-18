const participants = [
    { name: "Nacho", wishlist: ["Book", "Airphones", "Hoodie"] },
    { name: "Paco", wishlist: ["Watch", "Pants"] },
    { name: "Lulú", wishlist: ["Airpods", "Glasses"] },
    { name: "Fátima", wishlist: ["Makeup", "Purse"] },
    { name: "Dad", wishlist: ["Wallet", "Book"] },
    { name: "Mom", wishlist: ["Purse", "Sunglasses"] }
];

let availableParticipants = [...participants]; // Copia para evitar repeticiones

const canvas = document.getElementById('roulette');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spin');
const resultDiv = document.getElementById('result');

const radius = canvas.width / 2;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Dibujar la ruleta
function drawRoulette() {
    const sliceAngle = (2 * Math.PI) / participants.length;

    participants.forEach((participant, i) => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, i * sliceAngle, (i + 1) * sliceAngle);
        ctx.fillStyle = i % 2 === 0 ? "#ff0015" : "#007a29"; // Alterna colores
        ctx.fill();
        ctx.stroke();
 
        // Agregar nombres
        const textAngle = i * sliceAngle + sliceAngle / 2;
        ctx.fillStyle = "#fff";
        ctx.font = "16px Jokerman";
        ctx.fillText(
            participant.name,
            centerX + Math.cos(textAngle) * (radius / 1.5),
            centerY + Math.sin(textAngle) * (radius / 1.5)
        );
    });
}

drawRoulette();

// Girar la ruleta
let currentRotation = 0;

spinButton.addEventListener('click', () => {
    const currentUser = document.getElementById('user').value;

    if (!currentUser) {
        resultDiv.textContent = "Please slect your name before spinning the wheel.";
        return;
    }

    if (availableParticipants.length === 0) {
        resultDiv.textContent = "There are no more people left.";
        return;
    }

    let selectedPerson;
    let selectedIndex;
    let attempts = 0; // Para evitar loops infinitos

    do {
        const randomSpin = Math.random() * 360 + 720; // Mínimo 2 vueltas completas
        const sliceAngle = 360 / participants.length;

        currentRotation += randomSpin;

        selectedIndex = Math.floor(
            (participants.length - (currentRotation % 360) / sliceAngle) % participants.length
        );

        selectedPerson = availableParticipants[selectedIndex];

        attempts++;
        if (attempts > 100) break; // Previene bloqueos si algo falla
    } while (selectedPerson.name === currentUser);

    if (!selectedPerson) {
        resultDiv.textContent = "A valid participant could not be found. Please try again.";
        return;
    }

    availableParticipants.splice(selectedIndex, 1); // Asigna y elimina

    // Animar la ruleta
    canvas.style.transition = "transform 3s ease-out";
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        canvas.style.transition = "none";
        canvas.style.transform = `rotate(${currentRotation % 360}deg)`;

        resultDiv.innerHTML = `
            <h2>Your person is: ${selectedPerson.name}</h2>
            <p>Whish list:</p>
            <ul>
                ${selectedPerson.wishlist.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
    }, 3000);
});