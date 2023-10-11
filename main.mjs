import { inputFormatter } from "./inputFormatter.mjs";

const drawNumbers = [
	1, 76, 38, 96, 62, 41, 27, 33, 4, 2, 94, 15, 89, 25, 66, 14, 30, 0, 71, 21,
	48, 44, 87, 73, 60, 50, 77, 45, 29, 18, 5, 99, 65, 16, 93, 95, 37, 3, 52, 32,
	46, 80, 98, 63, 92, 24, 35, 55, 12, 81, 51, 17, 70, 78, 61, 91, 54, 8, 72, 40,
	74, 68, 75, 67, 39, 64, 10, 53, 9, 31, 6, 7, 47, 42, 90, 20, 19, 36, 22, 43,
	58, 28, 79, 86, 57, 49, 83, 84, 97, 11, 85, 26, 69, 23, 59, 82, 88, 34, 56,
	13,
];

const numbersInput = inputFormatter("./input.txt");

/**
 * Create 5x5 bingo boards.
 */
function boardBuilder(boardNumbers) {
	const boards = [];
	let board = [];
	let row = [];

	boardNumbers.forEach((number, i) => {
		// Create a row for every five items
		row.push(number);
		if ((i + 1) % 5 == 0) {
			board.push(row);
			row = [];
		}

		// Create a board for every 25 items (ie. every five rows)
		if ((i + 1) % 25 == 0) {
			boards.push(board);
			board = [];
		}
	});

	return boards;
}

const boards = boardBuilder(numbersInput);

/**
 * Mark drawn number and replace matching number with 'x'.
 *
 * Skips boards that already got bingo.
 */
function mark(number) {
	boards.forEach((board) => {
		if (board[board.length - 1] !== "won") {
			board.forEach((row) => {
				if (row.indexOf(number) !== -1) {
					row[row.indexOf(number)] = "x";
				}
			});
		}
	});
}

/**
 * Returns boards that got horizontal (row) and/or vertical (column) bingo.
 */
function check(boards) {
	const bingoCondition = (entry) => typeof entry === "string";
	let winningBoard = [];

	boards.forEach((board) => {
		if (board[board.length - 1] !== "won") {
			// Check row for bingo
			if (board[board.length - 1] !== "won") {
				board.forEach((row) => {
					if (row.every(bingoCondition)) {
						board.push("won");
						winningBoard = board;
					}
				});
			}

			// Check column for bingo
			for (let columnIndex = 0; columnIndex < 5; columnIndex++) {
				if (board.every((row) => bingoCondition(row[columnIndex]))) {
					board.push("won");
					winningBoard = board;
				}
			}
		}
	});

	if (winningBoard.length > 0) {
		return winningBoard;
	}
}

/**
 * Add all the numbers of a board with bingo.
 */
function calculateBoardScore(board) {
	return board
		.map((row) => {
			return row.filter((value) => typeof value === "number");
		})
		.flat()
		.reduce((prev, curr) => prev + curr, 0);
}

/**
 * Loop through all numbers in drawNumbers and mark each board.
 *
 * Check for bingo after at least five numbers have been drawn.
 *
 * Store winning boards to eventually be able to get the last winning board.
 */
function playBingo() {
	// Store array length since elements will be shifted from drawNumbers.
	const length = drawNumbers.length;
	let winningBoards = [];
	let winningNumbers = [];

	for (let i = 0; i < length; i++) {
		let number = drawNumbers.shift();

		mark(number);

		if (i >= 4) {
			let board = check(boards);
			if (board) {
				winningBoards.push(board);
				winningNumbers.push(number);
			}
		}
	}

	const lastWinningBoard = winningBoards[winningBoards.length - 1];
	const lastWinningNumber = winningNumbers[winningNumbers.length - 1];

	// Remove 'won' element before calculating score
	lastWinningBoard.pop();

	let score = calculateBoardScore(lastWinningBoard);

	const finalScore = lastWinningNumber * score;

	return finalScore;
}

console.log(playBingo());
