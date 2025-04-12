// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const cardForm = document.getElementById('card-form');
    const deckNameInput = document.getElementById('deck-name');
    const questionInput = document.getElementById('card-question');
    const answerInput = document.getElementById('card-answer');
    const addCardBtn = document.getElementById('add-card-btn');
    const saveDeckBtn = document.getElementById('save-deck-btn');
    const feedbackMessage = document.getElementById('feedback-message');
    const deckCardCountDisplay = document.getElementById('deck-card-count');

    const cardPreview = document.getElementById('card-preview');
    const cardPreviewFront = cardPreview.querySelector('.card-front p');
    const cardPreviewBack = cardPreview.querySelector('.card-back p');

    // --- Data Structures ---
    let currentDeck = []; // Holds cards { question, answer } for the deck being built

    // --- Functions ---

    /**
     * Displays a feedback message to the user.
     * @param {string} message - The message to display.
     * @param {string} type - 'success' or 'error'.
     */
    function showFeedback(message, type = 'success') {
        feedbackMessage.textContent = message;
        feedbackMessage.className = `feedback ${type}`; // Reset classes and add type
        // Optionally clear message after a few seconds
        setTimeout(() => {
            feedbackMessage.textContent = '';
            feedbackMessage.className = 'feedback';
        }, 3000);
    }

    /**
     * Updates the card count display for the current deck.
     */
     function updateCardCount() {
        const count = currentDeck.length;
        deckCardCountDisplay.textContent = `Cards in current deck: ${count}`;
     }

    /**
     * Updates the card preview element.
     * @param {object} card - The card object { question, answer }.
     */
    function updateCardPreview(card) {
        cardPreviewFront.textContent = card.question || '(Question will appear here)';
        cardPreviewBack.textContent = card.answer || '(Answer will appear here)';
        // Ensure card is visible and shows front face initially
        cardPreview.classList.remove('is-flipped');
        // Maybe add a class if content exists vs placeholder?
    }

    /**
     * Flips the card preview.
     */
    function flipCardPreview() {
        cardPreview.classList.toggle('is-flipped');
    }

    /**
     * Handles adding a new card to the current deck.
     */
    function handleAddCard() {
        const question = questionInput.value.trim();
        const answer = answerInput.value.trim();

        // Basic Validation
        if (!question || !answer) {
            showFeedback('Please fill in both question and answer.', 'error');
            return;
        }

        const newCard = { question, answer };
        currentDeck.push(newCard);

        showFeedback('Card added successfully!', 'success');
        updateCardPreview(newCard); // Show the newly added card
        updateCardCount();

        // Clear input fields after adding
        questionInput.value = '';
        answerInput.value = '';
        questionInput.focus(); // Focus back on question for next card
    }

    /**
     * Handles saving the current deck to local storage.
     */
    function handleSaveDeck() {
        const deckName = deckNameInput.value.trim();

        // Validation
        if (!deckName) {
            showFeedback('Please enter a name for the deck.', 'error');
            deckNameInput.focus();
            return;
        }
        if (currentDeck.length === 0) {
            showFeedback('Cannot save an empty deck. Add some cards first.', 'error');
            return;
        }

        try {
            // Get existing decks or initialize if none exist
            let decks = JSON.parse(localStorage.getItem('flashCardDecks')) || {};

            // Save current deck (overwrite if name exists)
            decks[deckName] = currentDeck;

            // Store updated decks object back in local storage
            localStorage.setItem('flashCardDecks', JSON.stringify(decks));

            showFeedback(`Deck "${deckName}" saved successfully! (${currentDeck.length} cards)`, 'success');

            // Optional: Clear current deck and fields after saving
            currentDeck = [];
            questionInput.value = '';
            answerInput.value = '';
            // deckNameInput.value = ''; // Keep deck name maybe? Or clear. User choice.
            updateCardPreview({ question: '', answer: '' }); // Clear preview
            updateCardCount();


        } catch (error) {
            console.error("Error saving deck to local storage:", error);
            showFeedback('An error occurred while saving the deck.', 'error');
        }
    }

    // --- Event Listeners ---
    addCardBtn.addEventListener('click', handleAddCard);
    saveDeckBtn.addEventListener('click', handleSaveDeck);
    cardPreview.addEventListener('click', flipCardPreview);

    // Optional: Live preview update as user types (can be resource intensive)
    // questionInput.addEventListener('input', () => updateCardPreview({ question: questionInput.value, answer: answerInput.value }));
    // answerInput.addEventListener('input', () => updateCardPreview({ question: questionInput.value, answer: answerInput.value }));

     // --- Initialization ---
     updateCardPreview({ question: '', answer: '' }); // Initialize preview with placeholders
     updateCardCount(); // Initialize card count display

    // You could add logic here to load an existing deck if the name is pre-filled
    // or load the last saved deck, but for Phase 1, saving is the primary goal.

}); // End DOMContentLoaded