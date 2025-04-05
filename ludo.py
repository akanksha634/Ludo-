import random

class Player:
    def _init_(self, name):
        self.name = name
        self.pieces = [-1] * 4  # -1 means the piece is not on the board yet
        self.positions = set()  # Track unique positions of each player's pieces

    def roll_dice(self):
        return random.randint(1, 6)

    def move_piece(self, piece_index, dice_roll):
        if self.pieces[piece_index] == -1:
            if dice_roll == 6:
                self.pieces[piece_index] = 0  # Move the piece to start position
                self.positions.add(0)
                return True
        else:
            new_position = self.pieces[piece_index] + dice_roll
            if new_position <= 57:
                self.positions.discard(self.pieces[piece_index])  # Remove old position
                self.pieces[piece_index] = new_position
                self.positions.add(new_position)
                return True
        return False

    def has_won(self):
        return all(pos == 57 for pos in self.pieces)

def check_and_kill(players, current_player):
    safe_positions = {-1, 9, 14, 22, 27, 35, 40, 48, 57}
    for other_player in players:
        if other_player == current_player:
            continue
        for i in range(4):
            if other_player.pieces[i] in current_player.positions and other_player.pieces[i] not in safe_positions:
                print(f"{current_player.name} killed {other_player.name}'s piece at {other_player.pieces[i]}")
                other_player.positions.discard(other_player.pieces[i])
                other_player.pieces[i] = -1  # Send piece back to start

def play_game():
    player_names = [input(f"Enter name for Player {i+1}: ") for i in range(4)]
    players = [Player(name) for name in player_names]
    turn = 0
    while True:
        current_player = players[turn % 4]
        while True:
            print(f"{current_player.name}'s turn")
            input("Press Enter to roll the dice...")
            dice_roll = current_player.roll_dice()
            print(f"{current_player.name} rolled a {dice_roll}")
            
            if dice_roll != 6 and all(piece == -1 for piece in current_player.pieces):
                print(f"{current_player.name} did not roll a 6 and has no pieces on the board. Skipping turn.")
                break
            
            moved = False
            while True:
                print(f"{current_player.name}'s pieces: {current_player.pieces}")
                try:
                    piece_index = int(input("Choose a piece to move (0-3): "))
                    if 0 <= piece_index < 4 and current_player.move_piece(piece_index, dice_roll):
                        moved = True
                        break
                    else:
                        print("Invalid move, try again.")
                except ValueError:
                    print("Please enter a valid number.")
            
            check_and_kill(players, current_player)
            
            if current_player.has_won():
                print(f"{current_player.name} has won the game!")
                return
            
            if dice_roll != 6:
                break  # End turn if not 6
        
        turn += 1

if _name_ == "_main_":
    play_game()
'''Test cases'''
import random

class Player:
    def init(self, name):
        self.name = name
        self.pieces = [-1] * 4  # -1 means the piece is not on the board yet
        self.positions = set()  # Track unique positions of each player's pieces

    def roll_dice(self):
        return random.randint(1, 6)

    def move_piece(self, piece_index, dice_roll):
        if self.pieces[piece_index] == -1:
            if dice_roll == 6:
                self.pieces[piece_index] = 0  # Move the piece to start position
                self.positions.add(0)
                return True
        else:
            new_position = self.pieces[piece_index] + dice_roll
            if new_position <= 57:
                self.positions.discard(self.pieces[piece_index])  # Remove old position
                self.pieces[piece_index] = new_position
                self.positions.add(new_position)
                return True
        return False

    def has_won(self):
        return all(pos == 57 for pos in self.pieces)

def check_and_kill(players, current_player):
    safe_positions = {-1, 9, 14, 22, 27, 35, 40, 48, 57}
    for other_player in players:
        if other_player == current_player:
            continue
        for i in range(4):
            if other_player.pieces[i] in current_player.positions and other_player.pieces[i] not in safe_positions:
                print(f"{current_player.name} killed {other_player.name}'s piece at {other_player.pieces[i]}")
                other_player.positions.discard(other_player.pieces[i])
                other_player.pieces[i] = -1  # Send piece back to start

def play_game():
    player_names = [input(f"Enter name for Player {i+1}: ") for i in range(4)]
    players = [Player(name) for name in player_names]
    turn = 0
    test_cases = [
        (6, 0), (6, 0), (5, None), (6, 0), (5, 0), (6, 0), (4, 0),
        (6, 0), (2, None), (3, 0), (6, 1), (6, 2), (5, 3), (6, 3),
        (6, 3), (5, 2), (4, 1), (3, 0), (6, 2), (2, None), (6, 3),
        (6, 3), (4, 3), (5, 1), (6, 1), (1, 0), (6, 0), (6, 1),
        (5, 2), (6, 3), (4, 1), (6, 2), (3, 3), (6, 3), (5, 1),
        (6, 1), (6, 2), (4, 2), (5, 3), (6, 3), (2, None), (6, 1),
        (6, 0), (5, 1), (4, 0), (6, 2), (6, 3), (5, 1), (6, 2),
        (4, 0), (6, 3), (6, 3), (5, 3), (4, 2), (6, 1), (3, 1),
        (6, 0), (6, 1), (6, 2), (6, 3), (5, 0), (4, 1), (6, 2),
        (3, 3), (6, 0), (6, 1), (6, 2), (6, 3), (4, 0), (5, 1),
        (6, 2), (6, 3), (3, 1), (6, 2), (4, 3), (6, 1), (2, None)
    ]
    for dice_roll, piece_index in test_cases:
        current_player = players[turn % 4]
        print(f"{current_player.name}'s turn")
        print(f"{current_player.name} rolled a {dice_roll}")
        
        if dice_roll != 6 and all(piece == -1 for piece in current_player.pieces):
            print(f"{current_player.name} did not roll a 6 and has no pieces on the board. Skipping turn.")
            turn += 1
            continue
        
        if piece_index is not None:
            current_player.move_piece(piece_index, dice_roll)
        check_and_kill(players, current_player)
        
        if current_player.has_won():
            print(f"{current_player.name} has won the game!")
            return
        
        if dice_roll != 6:
            turn += 1

if name == "main":
    play_game()
