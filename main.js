const abilityCards = document.querySelectorAll(".ability-card");
const abilityDetail = document.getElementById("ability-detail");
const bgMusic = document.getElementById("bg-music");

const abilityTexts = {
  kitchen:
    "<strong>Baker Diff:</strong> All enemies suffer −50 morale when you show up with fresh bread or cookies. Allies gain +30 happiness and +20 comfort.",
  decor:
    "<strong>Decoration Ult:</strong> After channeling for two months, you transform the entire house into a Christmas snow x Australiana crossover and solo an Alice-in-Wonderland garage. Aesthetic +100.",
  sarcasm:
    "<strong>“You Okay?”:</strong> Auto-casts after every headshot or 1v1 win. Deals 200 emotional damage while the target still says “yeah yeah I’m fine dw.”",
  dynamite:
    "<strong>Dynamite Ult:</strong> Activates whenever you queue with Wario1. Explodes into laughter, chaos, and perfectly timed sarcasm. Grants max synergy in Valorant, and any co-op missions."
};

abilityDetail.innerHTML = abilityTexts.kitchen;

abilityCards.forEach(card => {
  card.addEventListener("click", () => {
    abilityCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    const id = card.dataset.ability;
    abilityDetail.innerHTML = abilityTexts[id] || "";
  });
});

// Ensure music starts after any interaction if autoplay is blocked
if (bgMusic) {
  document.addEventListener(
    "click",
    () => {
      bgMusic.play().catch(() => {});
    },
    { once: true }
  );
}
