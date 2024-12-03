import { request, getUserID } from "@/axios_helper";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import SnackbarNoti from "@/components/SnackbarNoti";
import { Typography } from "@mui/material";
import { width } from "@mui/system";

export default function Game() {
    const [user, setUser] = useState({});
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const sketchRef = useRef();
    const birdImageRef = useRef();

    useEffect(() => {
        request("GET", `/users/${getUserID()}`, null)
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        const canvas = sketchRef.current;
        const ctx = canvas.getContext("2d");

        // Load bird image
        const birdImage = new Image();
        birdImage.src = "/flap.png";
        birdImageRef.current = birdImage;

        // Game settings
        const gravity = 0.4;
        const lift = -10;
        const pipeWidth = 100;
        const pipeGap = 200;
        const pipeSpacing = 500
        const pipeSpeed = 4

        let bird = { x: 50, y: 150, radius: 20, velocity: 0 };
        let pipes = [];
        let score = 0;
        let animationFrame;
        let gameOver = false;

        // Initialize pipes
        function resetGame() {
            bird = { x: 50, y: 150, radius: 20, velocity: 0 };
            pipes = [];
            score = 0;
            gameOver = false;
            for (let i = 0; i < Math.floor(window.innerWidth / pipeSpacing); i++) {
                addPipe(i * pipeSpacing + 300);
            }
        }

        function addPipe(x) {
            const topHeight = Math.random() * (canvas.height / 2);
            pipes.push({ x, topHeight });
        }

        // Game loop
        function update() {
            if (gameOver) return;

            // Update bird
            bird.velocity += gravity;
            bird.y += bird.velocity;
            if (bird.y > canvas.height || bird.y < 0) {
                gameOver = true;
                setSnackbarMessage("Game Over! Your score: " + score);
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                return;
            }

            // Update pipes
            pipes.forEach((pipe) => {
                pipe.x -= pipeSpeed;
                if (pipe.x + pipeWidth < 0) {
                    pipe.x = canvas.width;
                    pipe.topHeight = Math.random() * (canvas.height / 2);
                    score++;
                }

                // Collision detection
                if (
                    bird.x + bird.radius > pipe.x &&
                    bird.x - bird.radius < pipe.x + pipeWidth &&
                    (bird.y - bird.radius < pipe.topHeight ||
                        bird.y + bird.radius > pipe.topHeight + pipeGap)
                ) {
                    gameOver = true;
                    setSnackbarMessage("Game Over! Your score: " + score);
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                }
            });

            render();
            animationFrame = requestAnimationFrame(update);
        }

        // Render function
        function render() {
            
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw bird
            ctx.drawImage(birdImageRef.current, bird.x - bird.radius*2, bird.y - bird.radius*2, bird.radius * 4, bird.radius * 3);     

            // Draw pipes
            pipes.forEach((pipe) => {
                ctx.fillStyle = "green";
                ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
                ctx.fillRect(
                    pipe.x,
                    pipe.topHeight + pipeGap,
                    pipeWidth,
                    canvas.height - pipe.topHeight - pipeGap
                );
            });

            // Draw score
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText("Score: " + score, 10, 20);
        }

        // Handle user input
        function handleKeyDown(e) {
            if (e.code === "Space" && !gameOver) {
                bird.velocity = lift;
            } else if (e.code === "Space" && gameOver) {
                resetGame();
                update();
            }
        }

        // Set up canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 200;
        resetGame();
        update();

        window.addEventListener("keydown", handleKeyDown);

        // Clean up
        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    function handleSnackbarClose() {
        setSnackbarOpen(false);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh', backgroundColor: '#4EBAC4'}}>
            <Navbar user={user} />
            <Typography variant="h3" align="center">Flappy Dog</Typography>
            <canvas ref={sketchRef}></canvas>
            <SnackbarNoti
                open={snackbarOpen}
                onClose={handleSnackbarClose}
                severity={snackbarSeverity}
                message={snackbarMessage}
            />
        </div>
    );
}