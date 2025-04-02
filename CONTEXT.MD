I'll break down the key gameplay implementation in the `app/play/page.tsx` file:

### Game States
The game has 3 main states managed by the `gameState` state variable:
1. "select" - Card selection phase
2. "battle" - Battle phase 
3. "result" - Results display phase

```typescript
const [gameState, setGameState] = useState<"select" | "battle" | "result">("select");
```

### Key Game Components

1. **Card Selection Phase**
```typescript
// Player selects 4 cards from their deck
const handleCardSelect = (card: StartupCard) => {
  if (selectedCards.includes(card)) {
    setSelectedCards(selectedCards.filter((c) => c !== card));
  } else if (selectedCards.length < 4) {
    setSelectedCards([...selectedCards, card]);
  }
};

// Start game once 4 cards are selected
const startGame = () => {
  if (selectedCards.length < 4) return;
  setGameState("battle");
  setCurrentRound(1);
  setPlayerScore(0);
  setAiScore(0);
};
```

2. **Battle Phase**
```typescript
// Player selects an attribute to battle with
const handleAttributeSelect = (attribute: string) => {
  setBattleAttribute(attribute);
  setIsTimerActive(false);

  const playerCard = selectedCards[currentRound - 1];
  const aiCard = aiDeck[currentRound - 1];

  // Compare values based on attribute type
  let playerWins = false;
  let isDraw = false;

  switch (attribute) {
    case "timeToUnicorn":
    case "founded":
      // Lower is better for these attributes
      playerWins = playerCard[attribute] < aiCard[attribute];
      isDraw = playerCard[attribute] === aiCard[attribute];
      break;
    default:
      // Higher is better for revenue and valuation
      playerWins = playerCard[attribute] > aiCard[attribute];
      isDraw = playerCard[attribute] === aiCard[attribute];
  }

  // Update scores
  if (isDraw) {
    setBattleResult("draw");
  } else if (playerWins) {
    setPlayerScore((prevScore) => prevScore + 1);
    setBattleResult("win");
  } else {
    setAiScore((prevScore) => prevScore + 1);
    setBattleResult("lose");
  }

  // Move to next round or end game
  setTimeout(() => {
    if (currentRound < 4) {
      setCurrentRound(currentRound + 1);
      setBattleAttribute(null);
      setBattleResult(null);
    } else {
      setGameState("result");
    }
  }, 2000);
};
```

3. **Timer System**
```typescript
// 15-second timer for each battle round
useEffect(() => {
  let timer: NodeJS.Timeout;

  if (isTimerActive && timeLeft > 0) {
    timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
  } else if (isTimerActive && timeLeft === 0) {
    // Auto-select a random attribute if time runs out
    const attributes = ["founded", "revenue", "timeToUnicorn", "valuation"];
    const randomAttr = attributes[Math.floor(Math.random() * attributes.length)];
    handleAttributeSelect(randomAttr);
  }

  return () => clearTimeout(timer);
}, [timeLeft, isTimerActive]);
```

4. **Daily Challenge System**
```typescript
useEffect(() => {
  // Get today's date-based seed
  const dateSeed = getDateSeed();

  // Shuffle using deterministic algorithm based on the date
  const shuffled = [...startupData].sort(() => 0.5 - Math.random());

  // Assign 8 cards to each player
  setPlayerDeck(shuffled.slice(0, 8));
  setAiDeck(shuffled.slice(8, 16));

  // Calculate days since launch
  const launchDate = new Date("2025-03-31T00:00:00");
  const now = new Date();
  const dayDiff = Math.floor((now.getTime() - launchDate.getTime()) / 86400000);
  const dayNumber = dayDiff < 0 ? -1 : dayDiff + 1;

  setCurrentDay(dayNumber);
}, []);
```

5. **Scoring System**
- Each round won gives 1 point
- Final score is multiplied by 100
- Bonus points (+50) for overall victory

### Game Flow:
1. Player selects 4 cards from their deck
2. Each round (4 total):
   - Player has 15 seconds to select an attribute
   - Cards are compared based on the selected attribute
   - Winner gets a point
3. After 4 rounds:
   - Final scores are calculated
   - Results are displayed
   - Player can share results or play again

The game uses various animations and visual effects through Framer Motion to enhance the user experience, and includes features like:
- Daily challenges
- Share functionality
- Battle summaries
- Retro gaming effects
- Portal system for game transitions

This implementation creates a turn-based card battle game where players strategically choose attributes to compete against an AI opponent.
