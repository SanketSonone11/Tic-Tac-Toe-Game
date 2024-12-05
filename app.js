 
    const boxes = document.querySelectorAll(".box");
    const resetBtn = document.querySelector("#reset-btn");
    const newGameBtn = document.querySelector("#new-btn");
    const msgContainer = document.querySelector(".msg-container");
    const msg = document.querySelector("#msg");

    let turnX = true;  
    let count = 0;  
    const winPattern = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    // Determine mode based on the query parameter
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode"); // "friend" or "computer"

    // Check winner function
    const checkWinner = () => {
        for (let pattern of winPattern) {
            let [a, b, c] = pattern;
            if (
                boxes[a].innerText &&
                boxes[a].innerText === boxes[b].innerText &&
                boxes[a].innerText === boxes[c].innerText
            ) {
                showWinner(boxes[a].innerText);
                return true;
            }
        }
        return false;
    };

    // Show winner message
    const showWinner = (winner) => {
        msg.innerText = `Congratulations! ${winner} wins!`;
        msgContainer.classList.remove("hide");
        disableBoxes();
    };

    // Match draw 
    const matchDraw = () => {
        msg.innerText = "It's a draw!";
        msgContainer.classList.remove("hide");
        disableBoxes();
    };

    // Disable all boxes
    const disableBoxes = () => {
        boxes.forEach((box) => (box.disabled = true));
    };

    // Enable all boxes for reset
    const enableBoxes = () => {
        boxes.forEach((box) => {
            box.disabled = false;
            box.innerText = "";
        });
    };

    // Reset the game
    const resetGame = () => {
        turnX = true;
        count = 0;
        enableBoxes();
        msgContainer.classList.add("hide");
        msg.innerText = ""; // Clear message
    };

    // Play with a friend  
    const playWithFriend = () => {
        boxes.forEach((box) => {
            box.addEventListener("click", () => {
                if (box.innerText) return;

                box.innerText = turnX ? "X" : "O";
                box.disabled = true;
                count++;

                if (checkWinner()) return;

                if (count === 9) {
                    matchDraw();
                } else {
                    turnX = !turnX; // Switch turn
                }
            });
        });
    };

    // Play with computer 
    const playWithComputer = () => {
        const blockingMove = () => {
            for (let combination of winPattern) {
                const [a, b, c] = combination;

                if (
                    boxes[a].innerText === "X" && boxes[b].innerText === "X" && !boxes[c].innerText) {
                    boxes[c].innerText = "O";
                    boxes[c].disabled = true;
                    return true;  
                }
                if (boxes[b].innerText === "X" && boxes[c].innerText === "X" && !boxes[a].innerText) {
                    boxes[a].innerText = "O";
                    boxes[a].disabled = true;
                    return true;  
                }
                if (boxes[a].innerText === "X" && boxes[c].innerText === "X" && !boxes[b].innerText) {
                    boxes[b].innerText = "O";
                    boxes[b].disabled = true;
                    return true;  
                }
            }
            return false;  
        };

        const winningMove = () => {
            for (let combination of winPattern) {
                const [a, b, c] = combination;

                if (boxes[a].innerText === "O" && boxes[b].innerText === "O" && !boxes[c].innerText) {
                    boxes[c].innerText = "O";
                    boxes[c].disabled = true;
                    return true;  
                }
                if (boxes[b].innerText === "O" && boxes[c].innerText === "O" && !boxes[a].innerText) {
                    boxes[a].innerText = "O";
                    boxes[a].disabled = true;
                    return true; 
                }
                if (boxes[a].innerText === "O" && boxes[c].innerText === "O" && !boxes[b].innerText) {
                    boxes[b].innerText = "O";
                    boxes[b].disabled = true;
                    return true;  
                }
            }
            return false; 
        };

        const computerMove = () => {
            if (winningMove()) {
                count++;
                if (checkWinner()) return; // If winning  move results in a win, exit
                return; // Exit after winning move 
            }
            if (blockingMove()) {
                count++;
                if (checkWinner()) return; // If blocking move results in a win, exit
                return; // Exit after blocking move
            }
           

            // Random move
            let availableBoxes = [...boxes].filter((box) => !box.innerText);
            if (availableBoxes.length === 0) return;

            let randomIdx = Math.floor(Math.random() * availableBoxes.length);
            let box = availableBoxes[randomIdx];

            box.innerText = "O";
            box.disabled = true;
            count++;

            if (checkWinner()) return;
            if (count === 9) matchDraw();
        };

        boxes.forEach((box) => {
            box.addEventListener("click", () => {
                if (box.innerText) return;

                box.innerText = "X";
                box.disabled = true;
                count++;

                if (checkWinner()) return;

                if (count === 9) {
                    matchDraw();
                } else {
                    computerMove(); // Let the computer play
                }
            });
        });
    };

    // Initialize based on mode
    if (mode === "friend") {
        playWithFriend();
    } else if (mode === "computer") {
        playWithComputer();
    }

    // Attach reset button events
    newGameBtn.addEventListener("click", resetGame);
    resetBtn.addEventListener("click", resetGame);
 
