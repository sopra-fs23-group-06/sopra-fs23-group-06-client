import 'styles/ui/RuleBook.scss';
import { ButtonPurpleLobby } from './ButtonMain';

const RuleBook = ({ onClick }) => {
    const handleClose = (event) => {
        event.preventDefault();
        onClick();
    };

    return (
        <div className="rule-book">
            <h2>Rules</h2>
            {rules}
            <div className="rule-book-button">
                <ButtonPurpleLobby onClick={handleClose}>Close</ButtonPurpleLobby>
            </div>
        </div>
    );
};

let rules =
    <div className="rule-book-container">
        <div className="rule-book-content">
            <h1>Objective of the Game</h1>
            <p>
                The pirates' contest lasts 3-10 hands.
                In each hand, the players have to bid the number of tricks they intend to win in that hand.
                Then the objective is to fulfil that bid... <br />
                <div style={{ marginBottom: '0.8em' }}></div>
                Anyone who fails to fulfil their bid because they win too many or too few tricks loses glory and fame.
                It can be very lucrative to make a no-tricks bid. But it is also very risky... <br />
                <div style={{ marginBottom: '0.8em' }}></div>
                During the first hand each player has only one card at their disposal; from hand to hand the number of
                cards increases by one.
                In each hand the players endeavor to achieve as many points as possible.
                The player who was able to collect the most points after the chosen number of hands is the winner.
            </p>
            <h1>Game Settings</h1>
            <p>
                The host of the game can choose the number of hands dealt and the maximum number of players in the Game
                settings menu in the lobby.
                A number of 3-10 hands and 2-6 players can be selected before starting the game.
            </p>
            <h1>Setup</h1>
            <p>
                All the cards are shuffled well.
                Then cards are dealt to each player so that nobody can see them.
                The number of cards changes from one hand to the next.
                In the first hand each player receives only 1 card, in the second hand 2 cards and continuing until the
                last hand is dealt.
                Throughout the game, as many rounds are played as the players are holding cards in their hands.
                <br />
                <div style={{ marginBottom: '0.8em' }}></div>
                <strong> Example:</strong> it would not be possible to win 5 tricks if you are holding 4 cards as there
                will only be four rounds.
            </p>
            <h1>Game Turn</h1>
            <p>
                In each round every player has to out one card openly, one after the other. This is called a "trick".
                After dealing, each player looks at their card(s) and thinks about how many tricks they will win with
                this/these cards.
                As a sign that a player has decided on the number of tricks, they stretch a fist out towards the center
                of the table.
                <br />
                <div style={{ marginBottom: '0.8em' }}></div>
                When all the players are holding up their fists towards the middle of the table, they utter the pirates'
                battle cry "YO - HO - HO".
                As they do so all the players raise their fists and hammer them on the table with each word of the
                pirates' battle cry.
                With the second "HO" the players all open their fists at the same time and stretch out as many fingers
                as the tricks they want to win in that round.
                <br />
                <div style={{ marginBottom: '0.8em' }}></div>
                <strong> Note:</strong> Anyone who thinks they are capable of winning more than five tricks stretches
                out five fingers, at the same time naming the number loud and clear.
                The bids for each player are noted down in the narrow column on the notepad.<br />
                <div style={{ marginBottom: '0.8em' }}></div>
                In this online version of the game, the players enter their bids before each round and the "YO - HO -
                HO" is done automatically
                by the game when all players have entered their bids. The bids are also recorded automatically on the
                scoreboard.

                <h3>Which cards are there and which card wins the trick?</h3>

                It is always the player who has played the highest card that wins the trick.
                It is always the highest card of the suit being played.
                If other cards from other suits are played than the first card played (because the player doesn't have
                the suit) their value is irrelevant.
                Exception: The skull and crossbones flag (black) is the highest suit and it trumps all other suits
                (irrespective of its numerical value).
                All other suits rank equal to one another.
                <br />
                <div style={{ marginBottom: '0.8em' }}></div>
                <strong> Example:</strong> A "Yellow 2" is played, followed by a "Yellow 12".
                The next two players don't have any yellow and play a "Blue 13" and a "Black 1".
                The "Black 1" wins the trick because black is always the highest suit.
                Without the black card the "Yellow 12" would have won the trick because it was the highest card in the
                suit (yellow) being played.
                As a matter of principle a player must follow the suit first played.
                However, even if he could follow the suit, he can play a special card at any point during the game.
            </p>
            <h1>Hewing and Stabbing</h1>
            <p>
                Then the hewing and stabbing begins:
                The player to the left of the dealer begins the round by playing the first card.
                Clockwise the other players must follow the suit already played.
                This means playing a card from the same suit.
                Any player who can't follow suit plays a different one (and loses the trick) or a skull and crossbones
                flag (to win the trick if possible).
                When all the players have played a card they can see who gets the "trick".
                <br />
                <div style={{ marginBottom: '0.8em' }}></div>
                The player who has won the trick places it, facing down, in front of them, each trick separate from
                other tricks (enabling everyone to see clearly how many tricks the respective player already has), and
                then plays the first card of the next round.
                When all the cards have been played, the hand comes to an end and the scores are noted down.
                <br />
                <div style={{ marginBottom: '0.8em' }}></div>
                In this online version of the game, the number of tricks won by each player is recorded automatically on
                the scoreboard.
            </p>
            <h1>Special Cards</h1>
            <p>
                <h3>Escape Card</h3>
                <img src={require(`../../styles/images/cards/special/escape.png`)} alt="Escape Card"
                    style={{ width: '22%', display: 'block', margin: '0 auto', borderRadius: '15px' }}></img>
                <div style={{ marginBottom: '1.2em' }}></div>
                This card is worth "0" and is always the lowest card. It is played in order to not win a trick.
                However, if all the players play an "Escape" card, the trick is won by the player who played the first
                Escape card.

                <h3>Mermaid Card</h3>
                <img src={require(`../../styles/images/cards/special/mermaid.png`)} alt="Mermaid Card"
                    style={{ width: '22%', display: 'block', margin: '0 auto', borderRadius: '15px' }}></img>
                <div style={{ marginBottom: '1.2em' }}></div>
                The Mermaid is higher than all cards in the suits (also higher than the skull and crossbones flag), but
                is trumped by Pirate cards.
                It is also higher than the Skull King because the latter lets himself be beguiled by her: If the Mermaid
                is in the same trick as the Skull King, the Mermaid always wins the trick (no matter which other cards
                are also in the trick) and the player receives an additional bonus.

                <h3>Pirate Cards</h3>
                <img src={require(`../../styles/images/cards/special/badeye_joe.png`)} alt="Pirate Card"
                    style={{ width: '22%', display: 'block', margin: '0 auto', borderRadius: '15px' }}></img>
                <div style={{ marginBottom: '1.2em' }}></div>
                These cards are higher than all the cards of a suit (irrespective of the suit or value) and the Mermaid.
                There are only 3 ways not to win any tricks with a Pirate card:
                It is played after another Pirate card.
                It is trumped by a Skull King played later, or it is played after the Skull King.
                It is trumped by a Mermaid played in the same trick as the Skull King.

                <h3>Scary Mary Card</h3>
                <img src={require(`../../styles/images/cards/special/scary_mary_none.png`)} alt="Scary Mary Card"
                    style={{ width: '22%', display: 'block', margin: '0 auto', borderRadius: '15px' }}></img>
                <div style={{ marginBottom: '1.2em' }}></div>
                The Scary Mary can be played either as a Pirate card or as an Escape card.
                When playing this card the player says in which function he wishes to use the Scary Mary.
                If chosen as an Escape, only flags will be displayed in the corners, if chosen as a pirate, only skulls
                will be displayed.

                <h3> Skull King Card</h3>
                <img src={require(`../../styles/images/cards/special/skull_king.png`)} alt="Skull King Card"
                    style={{ width: '22%', display: 'block', margin: '0 auto', borderRadius: '15px' }}></img>
                <div style={{ marginBottom: '1.2em' }}></div>
                The Skull King can only be trumped by a Mermaid.
                All other cards are lower than the Skull King.
                If there is a Pirate card in a trick which is won with the Skull King (the Scary Mary always counts as a
                pirate for this purpose, no matter how it is used), the player gets a bonus.
                <br />
                <div style={{ marginBottom: '0.8em' }}></div>
                Again, as a reminder: Special cards can be played at any time! Even if it is possible to follow suit!
                <br />
                <div style={{ marginBottom: '1.3em' }}></div>
                <strong>Notes:</strong>
                <br />
                <div style={{ marginBottom: '0.6em' }}></div>
                If the first card played is a special card, the next suit card to be played determines the suit to be
                followed for the further round.
                <br />
                <div style={{ marginBottom: '0.6em' }}></div>
                If the first card played is a skull and crossbones flag (black) a player who has no skull and cross-
                bones flag in their hand can play a card from another suit. They do not have to play a Pirate.
                <br />
                <div style={{ marginBottom: '0.6em' }}></div>
                If 2 Pirate cards are played in a round, the card first played is higher and wins the trick.
                <br />
                <div style={{ marginBottom: '0.6em' }}></div>
                If 2 Mermaid cards are played in a round, the card first played is higher and wins the trick.

            </p>
            <h1>Scoring</h1>
            <p>
                A player who bids their number of tricks correctly receives 20 points per trick that they have won.<br />
                <div style={{ marginBottom: '0.4em' }}></div>
                <strong> Example:</strong> David bids 3 tricks which he indeed gets. He receives a total of 60 points.
                <br />
                <div style={{ marginBottom: '1.2em' }}></div>
                A player who wins more or fewer tricks than bid, receives no plus points and no bonus points.
                They receive 10 minus points for each trick more or less than their bid.<br />
                <div style={{ marginBottom: '0.4em' }}></div>
                <strong> Example:</strong> Simon bids 5 tricks but only wins 1 trick. The difference is 4 tricks. So he
                gets 40 minus points.
                <br />
                <div style={{ marginBottom: '1.2em' }}></div>
                If a player bids for "no tricks" and manages not to make a trick, they receive points corresponding to
                the current round, multiplied by 10.
                <br />
                <div style={{ marginBottom: '0.4em' }}></div>
                <strong> Example:</strong> In round 4 Eloise makes a bid to win no tricks. At the end of the round she
                has actually managed not to win any tricks.
                She receives 40 points for this (round 4 times 10 points).
                <br />
                <div style={{ marginBottom: '1.2em' }}></div>
                However, if a player does not manage to do this, and is forced to take one or more tricks, they receive
                the same number of points, but as minus points.
                If a player bids "no tricks" and proves to be wrong, it is irrelevant if they get one or, for example,
                three tricks.
                <br />
                <div style={{ marginBottom: '0.4em' }}></div>
                <strong> Example:</strong> In round 9 David makes a bid to win no tricks. But in the course of the round
                he had to take two tricks.
                He receives -90 points for this (round 9 times 10 points).
                So a no-trick bid is also risky! It can mean that a player wins lots of points, but they can also lose a
                lot.
            </p>
            <h1>Bonus Points</h1>
            <p>
                The Bonus points can be won with cards bearing gold coins in the symbols.
                However, a player can only win bonus points if they manage to get exactly as many tricks as their bid.
                If a player doesn't manage to do so, no bonus points are awarded.
                <br />
                <div style={{ marginBottom: '0.8em' }}></div>
                If a player catches one or more Pirate cards in a trick with the Skull King, that player receives a
                bonus of 30 points for each Pirate card in the trick.
                The Scary Mary always counts as a pirate, even if she was played as the "Escape".
                <br />
                <div style={{ marginBottom: '0.8em' }}></div>
                If a player has caught the Skull King with his Mermaid in a trick, he receives a bonus of 50 points for
                it.
            </p>
            <h1>End of the Game</h1>
            <p>
                The game ends after the chosen number of hands has been played.
                The player with the highest score has bid cleverly, trumped successfully and won the battle.
            </p>
        </div>
    </div>

export default RuleBook