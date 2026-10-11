
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/assistant", async (req, res) => {
    try {
        const question = req.body.question;

        if (!question || typeof question !== "string") {
            return res.status(400).json({
                error: "Please enter a question."
            });
        }

        const response = await fetch(
            "http://127.0.0.1:11434/api/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama3.2:1b",
                    messages: [
                        {
                            role: "user",
                            content: question
                        }
                    ],
                    stream: false
                })
            }
        );

        if (!response.ok) {
            throw new Error("Ollama returned status " + response.status);
        }

        const data = await response.json();

        res.json({
            answer: data.message.content
        });

   
} catch (error) {
    console.error("Full AI error:", error);

    res.status(500).json({
        error: error.message || "AI request failed."
    });
}

});

app.listen(3000, () => {
    console.log("OpenLens AI: http://localhost:3000");
});
