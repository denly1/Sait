import { useState } from 'react';
import { X } from 'lucide-react';

interface BlackjackGameProps {
  onClose: () => void;
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

type Card = { suit: string; value: string; numValue: number };

const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export default function BlackjackGame({ onClose, balance, onBalanceChange }: BlackjackGameProps) {
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [bet, setBet] = useState(100);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'finished'>('betting');
  const [message, setMessage] = useState('');
  const [showDealerCard, setShowDealerCard] = useState(false);

  const createDeck = (): Card[] => {
    const deck: Card[] = [];
    suits.forEach(suit => {
      values.forEach((value, i) => {
        const numValue = i < 9 ? i + 2 : i === 12 ? 11 : 10;
        deck.push({ suit, value, numValue });
      });
    });
    return deck.sort(() => Math.random() - 0.5);
  };

  const calculateScore = (cards: Card[]): number => {
    let score = cards.reduce((sum, card) => sum + card.numValue, 0);
    let aces = cards.filter(card => card.value === 'A').length;
    
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    return score;
  };

  const startGame = () => {
    if (bet > balance) {
      setMessage('Недостаточно средств!');
      return;
    }

    onBalanceChange(balance - bet);
    const deck = createDeck();
    setPlayerCards([deck[0], deck[1]]);
    setDealerCards([deck[2], deck[3]]);
    setGameState('playing');
    setMessage('');
    setShowDealerCard(false);
  };

  const hit = () => {
    const deck = createDeck();
    const newCards = [...playerCards, deck[0]];
    setPlayerCards(newCards);
    
    if (calculateScore(newCards) > 21) {
      endGame(newCards, dealerCards);
    }
  };

  const stand = () => {
    let newDealerCards = [...dealerCards];
    const deck = createDeck();
    let deckIndex = 0;

    while (calculateScore(newDealerCards) < 17) {
      newDealerCards.push(deck[deckIndex++]);
    }
    
    setDealerCards(newDealerCards);
    setShowDealerCard(true);
    endGame(playerCards, newDealerCards);
  };

  const endGame = (pCards: Card[], dCards: Card[]) => {
    const playerScore = calculateScore(pCards);
    const dealerScore = calculateScore(dCards);
    setShowDealerCard(true);
    setGameState('finished');

    if (playerScore > 21) {
      setMessage('Перебор! Вы проиграли.');
    } else if (dealerScore > 21) {
      const winAmount = bet * 2;
      onBalanceChange(balance + winAmount);
      setMessage(`Дилер перебрал! Вы выиграли ${winAmount}₽`);
    } else if (playerScore > dealerScore) {
      const winAmount = bet * 2;
      onBalanceChange(balance + winAmount);
      setMessage(`Вы выиграли ${winAmount}₽!`);
    } else if (playerScore === dealerScore) {
      onBalanceChange(balance + bet);
      setMessage('Ничья! Ставка возвращена.');
    } else {
      setMessage('Дилер выиграл.');
    }
  };

  const CardComponent = ({ card, hidden }: { card: Card; hidden?: boolean }) => (
    <div className={`w-20 h-28 rounded-lg flex items-center justify-center text-2xl font-bold border-2 ${
      hidden ? 'bg-slate-700 border-slate-600' : 
      card.suit === '♥' || card.suit === '♦' ? 'bg-white text-red-600 border-red-600' : 'bg-white text-black border-black'
    }`}>
      {hidden ? '?' : `${card.value}${card.suit}`}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-green-900 to-green-950 rounded-2xl max-w-4xl w-full p-8 border border-amber-500/30">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-amber-400">Блэкджек</h2>
            <p className="text-slate-300">Баланс: {balance}₽</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-8 h-8" />
          </button>
        </div>

        {gameState === 'betting' && (
          <div className="text-center">
            <h3 className="text-2xl text-white mb-6">Сделайте ставку</h3>
            <div className="flex justify-center gap-4 mb-6">
              {[100, 500, 1000, 5000].map(amount => (
                <button
                  key={amount}
                  onClick={() => setBet(amount)}
                  className={`px-6 py-3 rounded-lg font-bold ${
                    bet === amount ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {amount}₽
                </button>
              ))}
            </div>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold text-xl hover:from-amber-600 hover:to-amber-700"
            >
              Начать игру
            </button>
          </div>
        )}

        {gameState !== 'betting' && (
          <div>
            <div className="mb-8">
              <h3 className="text-xl text-white mb-4">Дилер ({showDealerCard ? calculateScore(dealerCards) : '?'})</h3>
              <div className="flex gap-2">
                {dealerCards.map((card, i) => (
                  <CardComponent key={i} card={card} hidden={i === 1 && !showDealerCard} />
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl text-white mb-4">Вы ({calculateScore(playerCards)})</h3>
              <div className="flex gap-2">
                {playerCards.map((card, i) => (
                  <CardComponent key={i} card={card} />
                ))}
              </div>
            </div>

            {message && (
              <div className={`text-center text-2xl font-bold mb-6 ${
                message.includes('выиграли') ? 'text-green-400' : message.includes('проиграли') ? 'text-red-400' : 'text-amber-400'
              }`}>
                {message}
              </div>
            )}

            <div className="flex justify-center gap-4">
              {gameState === 'playing' && (
                <>
                  <button
                    onClick={hit}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                  >
                    Взять карту
                  </button>
                  <button
                    onClick={stand}
                    className="px-8 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
                  >
                    Хватит
                  </button>
                </>
              )}
              {gameState === 'finished' && (
                <button
                  onClick={() => {
                    setGameState('betting');
                    setPlayerCards([]);
                    setDealerCards([]);
                    setMessage('');
                  }}
                  className="px-8 py-3 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700"
                >
                  Новая игра
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
