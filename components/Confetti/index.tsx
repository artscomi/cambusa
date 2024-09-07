import confetti from "canvas-confetti";

export default function Confetti() {
  const startConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      shapes: ['star', 'circle']
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Congratulations!</h1>
      <button onClick={startConfetti} style={buttonStyle}>
        Start Coriandoli
      </button>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
};
